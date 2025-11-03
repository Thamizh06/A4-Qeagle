# app/schemas.py
from typing import Dict, List, Optional, Tuple
from pydantic import BaseModel, Field

SkillLevel = int  # 0 none, 1 beginner, 2 intermediate, 3 advanced

class Course(BaseModel):
    course_id: str
    title: str
    skills: List[str]
    difficulty: str
    duration_weeks: int
    prerequisites: List[str] = []
    outcomes: List[str] = []

class JD(BaseModel):
    jd_id: str
    role: str
    skills_required: Dict[str, SkillLevel]

class Profile(BaseModel):
    skills: Dict[str, SkillLevel] = Field(default_factory=dict)
    years: int
    goal_role: str

class AdviseRequest(BaseModel):
    profile: Profile
    prefs: Optional[Dict] = None

class PlanItem(BaseModel):
    course_id: str
    why: str
    citations: List[Dict] = Field(default_factory=list)

class Timeline(BaseModel):
    weeks: int
    sequence: List[Tuple[str, int, int]]

class AdviseResponse(BaseModel):
    plan: List[PlanItem]
    gap_map: Dict[str, int]
    timeline: Timeline
    notes: str
    metrics: Dict[str, float]
