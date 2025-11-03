import google.generativeai as genai
import structlog
from typing import Dict
from app.config import settings
from app.schemas import Course

log = structlog.get_logger()

def init_llm():
    """Initializes the Gemini model client."""
    if not settings.GOOGLE_API_KEY:
        log.warning("google_llm_skip", reason="GOOGLE_API_KEY not found in environment.")
        return None
    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        # Using gemini-1.5-flash as it's fast and cost-effective for this task
        model = genai.GenerativeModel('gemini-1.5-flash')
        log.info("google_llm_configured", model='gemini-1.5-flash')
        return model
    except Exception as e:
        log.error("google_llm_init_failed", error=str(e))
        return None

# Initialize the model when the module is loaded
llm_model = init_llm()


def generate_course_explanation(course: Course, goal_role: str, gap_map: Dict[str, int]) -> str:
    """Generates a personalized explanation for a course recommendation using Gemini."""
    
    # Fallback explanation if LLM is not available or fails
    gap_keys = set(gap_map.keys())
    covered_skills = set([t.split(":")[0] for t in course.skills]) & gap_keys
    fallback_why = f"Targets key skills like {', '.join(covered_skills)} to help you progress towards your goal of becoming a {goal_role}."

    if not llm_model:
        return fallback_why

    gap_skills_str = ", ".join(gap_keys)
    course_skills_str = ", ".join([s.split(":")[0] for s in course.skills])

    prompt = f"""
    You are an expert career advisor. Your task is to write a concise, compelling, and personalized explanation (1-2 sentences) for why a specific course is recommended to a user.

    **User Profile:**
    - Goal Role: {goal_role}
    - Key Skill Gaps to Fill: {gap_skills_str}

    **Recommended Course:**
    - Title: {course.title}
    - Skills Covered: {course_skills_str}
    - Main Outcomes: {', '.join(course.outcomes)}

    **Your Explanation:**
    """

    try:
        response = llm_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        log.error("gemini_api_call_failed", course_id=course.course_id, error=str(e))
        return fallback_why # Return the safe fallback on API error