# A4 — Upskill Advisor (RAG over Courses + JDs)

A full‑stack demo that recommends a **3‑course upskilling path** for a candidate targeting a role (e.g., **SDET**, **GenAI QA**).  
Back end offers **hybrid retrieval** (BM25 + embeddings) with **re‑rank + planning**, and front end shows plan, gap map, timeline, metrics, and PDF export.

---

## ✨ What’s inside

- **Frontend:** React (Vite), TypeScript/JS, Tailwind (optional), simple API client.
- **Backend:** FastAPI (Python 3.10+), `rank-bm25`, `sentence-transformers`, scikit‑learn NN, structlog, ReportLab.
- **Data:** JSONL catalogs for **courses** and **job descriptions (JDs)**.
- **RAG Flow:** BM25 + Vector → RRF fusion → (optional) cross‑encoder re‑rank → 3‑course planner → gap map + timeline.
- **Observability:** `/metrics` endpoint, structured logs, simple trace ids.
- **PDF:** `/plan/pdf` to download a one‑page plan.

---

## ✅ Prerequisites

Install these before running locally:

- **Python** 3.10+ (3.11 ok). Verify: `python --version`
- **pip** 23+ (`python -m pip --version`)
- **Node.js** 18+ (or 20+ recommended). Verify: `node -v`
- **npm** 9+ (or **pnpm**/**yarn** if you prefer). Verify: `npm -v`
- OS packages (first run only): will download model weights for `sentence-transformers` automatically.

> If you use **Windows**, run commands in **PowerShell**; for **macOS/Linux**, use a shell (bash/zsh).

---

## 📁 Repository Layout

```text
upskill-advisor/
  backend/
    app/
      __init__.py
      main.py                # FastAPI app (this file)
      config.py              # settings (env-driven), e.g. RERANK_TOPN
      schemas.py             # pydantic models (Course, JD, Profile, Advise*)
      services/
        planner.py           # compute gaps, pick 3-course path, timeline, citations
        pdf.py               # ReportLab PDF generator
        safety.py            # PII redaction, prompt-injection checks
        metrics.py           # timers + p50/p95/error tracking
      retrieval/
        bm25.py              # BM25 index and search
        vector.py            # sentence-transformers embeddings + NN
        hybrid.py            # RRF fusion + rerank()
      data/
        courses.jsonl        # each line is one course JSON object
        jds.jsonl            # each line is one JD JSON object
    requirements.txt
  frontend/
    src/
      pages/ components/ lib/  # your React code
    package.json
    vite.config.ts
  README.md
```

---
## Frontend — Setup & Run
**Windows (PowerShell)**
```powershell
cd frontend
npm install 
npm run dev
```

## 🐍 Backend — Setup & Run

### 1) Create and activate a virtual environment

**macOS/Linux**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell)**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 2) Install dependencies

If you **have** `requirements.txt` already, use it:
```bash
pip install -r requirements.txt
```

If you need to create one, here is a ready list (pin versions as per your project):
```text
fastapi==0.114.1
uvicorn[standard]==0.30.6
pydantic==2.9.2
numpy==1.26.4
scikit-learn==1.5.2
rank-bm25==0.2.2
sentence-transformers==3.1.1
langchain==0.2.16
langchain-community==0.2.16
langchain-pinecone==0.1.3
pinecone-client[grpc]==5.0.1
httpx==0.27.2
structlog==24.4.0
reportlab==4.2.2
python-dotenv==1.0.1
```

> On first run, `sentence-transformers` will download model weights (e.g., `all-MiniLM-L6-v2`).

### 3) Environment variables (optional)

Create `backend/.env` if you want to override defaults:

```ini
# example keys (your app.config may expose more)
RERANK_TOPN=8
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CROSS_ENCODER_MODEL=cross-encoder/ms-marco-MiniLM-L-6-v2
```

### 4) Run the API (dev mode)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API base: `http://localhost:8000`

> **CORS:** The app should include `CORSMiddleware` allowing `http://localhost:5173`. If you see CORS errors from the frontend, verify the middleware block is present (see Troubleshooting).

### 5) Seed data (JSONL)

Put your files in `backend/app/data/`:

- `courses.jsonl` — each line is a JSON object:
  ```json
  {"course_id":"C101","title":"Python for Testers","skills":["python:b","oop:b"],"difficulty":"beginner","duration_weeks":4,"prerequisites":[],"outcomes":["write basic python","functions","collections"]}
  ```

- `jds.jsonl` — each line is a JSON object:
  ```json
  {"jd_id":"JD_SDET","role":"SDET","skills_required":{"python":2,"selenium":2,"pytest":2,"api":2,"ci":1,"git":1,"docker":1,"oop":1}}
  ```

Restart the server after edits so it reloads the catalogs.

### 6) Key endpoints

- `GET /health` → `{"ok": true}`  
- `GET /course/{course_id}` → course object  
- `GET /metrics` → latency/error stats  
- `POST /advise` → main plan output  
- `POST /plan/pdf` → returns a 1‑page PDF

#### Example `/advise` request (JSON)

> **Important:** `profile.skills` is a **dictionary** of `skill -> int` (1=beginner, 2=intermediate, 3=advanced), and `years` is an **integer**.

```json
{
  "profile": {
    "skills": {
      "manual-qa": 2,
      "python": 1,
      "pytest": 1,
      "oop": 1
    },
    "years": 2,
    "goal_role": "SDET"
  },
  "prefs": { "max_weeks": 16 }
}
```

#### curl smoke tests

```bash
curl -s http://localhost:8000/health

curl -s http://localhost:8000/metrics

curl -s -X POST http://localhost:8000/advise \
  -H "Content-Type: application/json" \
  -d '{
    "profile":{"skills":{"manual-qa":2,"python":1,"pytest":1,"oop":1},"years":2,"goal_role":"SDET"},
    "prefs":{"max_weeks":16}
  }' | jq .
```

---

## ⚛️ Frontend — Setup & Run

### 1) Install dependencies
```bash
cd frontend
npm install
# or: pnpm install / yarn install
```

### 2) Configure API base (optional but recommended)

If your code uses an env var, create `frontend/.env`:

```ini
VITE_API_BASE_URL=http://localhost:8000
```

Then in your `api.ts` you might reference it like:
```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
```

### 3) Run the dev server
```bash
npm run dev
```
Open the URL Vite prints, typically: `http://localhost:5173`.

> If you see CORS errors, ensure the backend has `CORSMiddleware` allowing `http://localhost:5173`.  
> **Alternative:** use a Vite proxy to avoid CORS during dev. In `vite.config.ts`:
> ```ts
> export default defineConfig({
>   server: {
>     proxy: {
>       '/api': {
>         target: 'http://localhost:8000',
>         changeOrigin: true,
>         rewrite: (p) => p.replace(/^\/api/, ''),
>       },
>     },
>   },
> })
> ```
> And call `/api/health` from the frontend.

---

## 🔌 Postman (optional)

Import a simple collection or use curl. Example request for `/advise` is shown above. Ensure `goal_role` matches a role in `jds.jsonl` exactly (e.g., `"SDET"`, `"GenAI QA"`).

---

## 🧪 Troubleshooting

**CORS blocked (preflight fail):**
- Add `from fastapi.middleware.cors import CORSMiddleware` and:
  ```py
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
      allow_methods=["*"],
      allow_headers=["*"],
      allow_credentials=False,
  )
  ```
- If using cookies (`credentials: 'include'`), set `allow_credentials=True` and don’t use `"*"` origins.

**`goal_role not supported in JD corpus`:**
- The server matches roles **exactly** to `JD.role`. Add a helper endpoint to list roles if needed:
  ```py
  @app.get("/roles")
  def list_roles():
      return {"roles": sorted([j.role for j in JDS.values()])}
  ```
- Or normalize role strings on load (lowercase/trim) and do the same on input.

**422 validation – `profile.skills` not a dict:**
- Send as:
  ```json
  "skills": { "python": 1, "pytest": 1 }
  ```
  not `["python:b", "pytest:b"]`.

**Years must be integer:**
- Schema uses `int`. Use `2` instead of `1.5`. (Change to `float` in `schemas.py` if you want half-years.)

**PDF missing or blank:**
- Ensure `reportlab` is installed and the process has write permission for temp files.
- Hit `POST /plan/pdf` with the same body as `/advise`.

---

## 🧾 License & Credits

For educational/demo use. Course/JD data are synthetic examples. Uses open‑source libraries cited above.
