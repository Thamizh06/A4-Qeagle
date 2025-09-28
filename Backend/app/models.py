from typing import List, Dict
from dataclasses import dataclass

@dataclass
class RetrievedDoc:
    source_id: str          # course_id or jd_id
    text: str
    meta: Dict
    score: float
