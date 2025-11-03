import json, os
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from typing import List, Dict
import structlog
from app.config import settings
from app.schemas import *
from app.services.metrics import metrics, new_trace_id
from app.services.safety import redact_pii, detect_prompt_injection
from app.services.pdf import render_plan_pdf
from app.services import planner
# --- NEW IMPORT ---
from app.services import llm
from app.retrieval.bm25 import build_bm25
from app.retrieval.vector import build_vectorstore
from app.retrieval.hybrid import build_hybrid_retriever, rerank
from sentence_transformers import SentenceTransformer  # as local fallback embed
from langchain_core.documents import Document
from fastapi.responses import FileResponse
import tempfile, os
from fastapi.middleware.cors import CORSMiddleware

log = structlog.get_logger()
app = FastAPI(title="A4 Upskill Advisor API")

# ... (keep the existing code for CORS, catalogs, retrievers, load_catalog, build_docs)
# In-memory catalogs
COURSES: Dict[str, Course] = {}
JDS: Dict[str, JD] = {}
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",      # Vite preview (optional)
    "http://127.0.0.1:4173"       # Vite preview (optional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # list exact origins in dev
    allow_credentials=False,   # set True only if you use cookies/auth
    allow_methods=["*"],
    allow_headers=["*"],
)

# LangChain retrievers
bm25_ret = None
vectorstore = None
hybrid = None

def load_catalog():
    base = os.path.join(os.path.dirname(__file__), "data")
    with open(os.path.join(base, "courses.jsonl")) as f:
        for line in f:
            c = Course.model_validate_json(line)
            COURSES[c.course_id] = c
    with open(os.path.join(base, "jds.jsonl")) as f:
        for line in f:
            j = JD.model_validate_json(line)
            JDS[j.role] = j

def build_docs() -> List[Dict]:
    docs = []
    # course docs
    for c in COURSES.values():
        txt = f"{c.title}. Skills: {', '.join(c.skills)}. Outcomes: {', '.join(c.outcomes)}. Diff: {c.difficulty}"
        docs.append({"text": txt, "meta": {"source_id": c.course_id, "kind":"course", "span":"skills"}})
    # jd docs
    for j in JDS.values():
        txt = f"{j.role} requires {j.skills_required}"
        docs.append({"text": txt, "meta": {"source_id": j.jd_id, "kind":"jd", "span":"skills_required"}})
    return docs

@app.on_event("startup")
def startup():
    load_catalog()
    docs = build_docs()
    global bm25_ret, vectorstore, hybrid
    bm25_ret = build_bm25(docs)
    vectorstore = build_vectorstore(docs)
    hybrid = build_hybrid_retriever(bm25_ret, vectorstore)
    # The LLM model is initialized automatically when llm.py is imported
    log.info("startup_complete", courses=len(COURSES), jds=len(JDS))


# ... (keep middleware and other endpoints like /health, /course, /metrics)
from starlette.responses import JSONResponse


@app.middleware("http")
async def add_trace_and_metrics(request: Request, call_next):
    trace_id = new_trace_id()
    t0 = metrics.start()
    response = None
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        metrics.error()
        # log the error with the trace id
        log.error("request_error", trace=trace_id, path=str(request.url), err=str(e))
        # return a safe JSON 500 response
        response = JSONResponse({"detail": "internal error", "trace": trace_id}, status_code=500)
        return response
    finally:
        dt = metrics.end(t0)
        status = getattr(response, "status_code", 500)
        log.info("request_log",
                 trace=trace_id,
                 path=str(request.url),
                 ms=round(dt * 1000, 2),
                 status=status)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/course/{course_id}", response_model=Course)
def get_course(course_id: str):
    if course_id not in COURSES:
        raise HTTPException(404, "course not found")
    return COURSES[course_id]

@app.get("/metrics")
def get_metrics():
    return metrics.snapshot()

@app.post("/advise", response_model=AdviseResponse)
def advise(req: AdviseRequest):
    # ... (Keep steps 1-7 as they are)
    # Safety filters (demo)
    text_blob = json.dumps({"goal_role": req.profile.goal_role, "skills": req.profile.skills})
    if detect_prompt_injection(text_blob):
        raise HTTPException(400, "Prompt injection suspected.")
    # Redact PII from free-text prefs if any
    prefs = {k: redact_pii(str(v)) for k, v in (req.prefs or {}).items()}

    # 1) Pick JD
    jd = JDS.get(req.profile.goal_role)
    if not jd:
        raise HTTPException(404, "goal_role not supported in JD corpus")

    # 2) Compute gaps
    gap_map = planner.compute_gap_map(jd, req.profile)

    # 3) Build query from gaps
    need = ", ".join([f"{k} lvl{v}" for k,v in gap_map.items()])
    query = f"Courses to cover: {need} for role {jd.role}"

    # 4) Hybrid retrieve then rerank
    cand_docs = hybrid.get_relevant_documents(query)
    reranked = rerank(query, cand_docs, topn=settings.RERANK_TOPN)

    # 5) Map retrieved courses -> Course objects
    ret_courses = []
    for d in reranked:
        if d.meta.get("kind") == "course" and d.source_id in COURSES:
            ret_courses.append(COURSES[d.source_id])

    # 6) Pick best 3-course path algorithmically (fast & deterministic)
    chosen = planner.pick_path(ret_courses, gap_map)
    if len(chosen) < 3:
        # fill from any remaining
        for c in COURSES.values():
            if c not in chosen and len(chosen)<3:
                chosen.append(c)

    # 7) Timeline & metrics
    total_weeks, seq = planner.build_timeline(chosen)
    covered = set()
    for c in chosen:
        for t in c.skills:
            k,_ = planner.parse_skill_tag(t)
            if k in gap_map: covered.add(k)
    coverage = len(covered) / max(1, len(jd.skills_required))
    all_sk = [planner.parse_skill_tag(t)[0] for c in chosen for t in c.skills]
    diversity = len(set(all_sk)) / max(1, len(all_sk))

    # --- STEP 8 IS NOW MODIFIED ---
    # 8) LLM to generate "why" messages via Google Gemini
    plan_items = []
    citations = planner.make_citations(reranked)
    for c in chosen:
        # Use the new LLM service to generate a rich, personalized explanation
        why_message = llm.generate_course_explanation(c, req.profile.goal_role, gap_map)
        plan_items.append({"course_id": c.course_id, "why": why_message, "citations": citations})

    return AdviseResponse(
        plan=[PlanItem(**p) for p in plan_items],
        gap_map=gap_map,
        timeline=Timeline(weeks=total_weeks, sequence=seq),
        notes="Path maximizes JD coverage with minimal prereqs; PDF available via /plan/pdf (see docs).",
        metrics={"coverage": round(coverage,3), "diversity": round(diversity,3)}
    )

# ... (keep the /plan/pdf endpoint as it is)
@app.post("/plan/pdf")
def plan_pdf(req: AdviseRequest):
    # Reuse advise() to compute the plan; if advise raises, middleware will handle it
    plan = advise(req)

    # Create a temp file path safely
    fd, path = tempfile.mkstemp(prefix="upskill_plan_", suffix=".pdf")
    os.close(fd)  # close the OS handle; ReportLab will open by path

    render_plan_pdf(
        path=path,
        name="Candidate",
        goal=req.profile.goal_role,
        plan=[p.model_dump() for p in plan.plan],
        gap_map=plan.gap_map,
        timeline=plan.timeline.model_dump()
    )

    # Let FastAPI serve & handle cleanup (you can delete later if needed)
    return FileResponse(path, media_type="application/pdf",filename="upskill_plan.pdf")