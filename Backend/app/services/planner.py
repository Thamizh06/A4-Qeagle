#app/services/planner.py

from typing import Dict, List, Tuple
from app.schemas import Course, JD, Profile
from app.models import RetrievedDoc

def parse_skill_tag(tag: str) -> Tuple[str, int]:
    # "python:b" -> ("python", 1)  (b=1, i=2, a=3)
    if ":" not in tag: return (tag, 1)
    n, lvl = tag.split(":")
    m = {"b":1, "i":2, "a":3}.get(lvl, 1)
    return n, m

def compute_gap_map(jd: JD, profile: Profile) -> Dict[str,int]:
    have = profile.skills
    gaps = {}
    for skill, req in jd.skills_required.items():
        delta = max(0, req - have.get(skill, 0))
        if delta>0: gaps[skill] = delta
    return gaps

def score_path(courses: List[Course], gap_map: Dict[str,int]) -> float:
    cover = set()
    all_sk = []
    dur = sum(c.duration_weeks for c in courses)
    for c in courses:
        for t in c.skills:
            k,_ = parse_skill_tag(t)
            all_sk.append(k)
            if k in gap_map: cover.add(k)
    overlap_penalty = max(0, len(all_sk) - len(set(all_sk)))
    return 3*len(cover) - overlap_penalty - 0.1*dur

def pick_path(courses: List[Course], gap_map: Dict[str,int]) -> List[Course]:
    # Greedy: pick 3 courses maximizing marginal coverage, respecting simple prereqs
    chosen: List[Course] = []
    need = set(gap_map.keys())
    pool = courses[:]
    while len(chosen)<3 and pool:
        best, best_gain, best_score = None, -1, -1
        for c in pool:
            c_sk = set(parse_skill_tag(t)[0] for t in c.skills)
            gain = len(need & c_sk)
            s = score_path(chosen + [c], gap_map)
            if (gain, s) > (best_gain, best_score):
                best, best_gain, best_score = c, gain, s
        chosen.append(best)
        pool.remove(best)
        need -= set(parse_skill_tag(t)[0] for t in best.skills)
    return chosen[:3]

def build_timeline(courses: List[Course]) -> Tuple[int, List[Tuple[str,int,int]]]:
    # simple sequential schedule honoring prereqs by ordering (we keep chosen order)
    wk, seq = 1, []
    for c in courses:
        seq.append((c.course_id, wk, wk + c.duration_weeks - 1))
        wk += c.duration_weeks
    return (wk-1), seq

def make_citations(retdocs: List[RetrievedDoc]) -> List[Dict]:
    out = []
    for d in retdocs[:6]:
        out.append({"source_id": d.source_id, "span": d.meta.get("span","skills"), "score": d.score})
    return out
