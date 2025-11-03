#app/services/safety.py

import re

PII_EMAIL = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
PII_PHONE = re.compile(r'(?<!\d)(?:\+?\d[\s-]?){9,14}\d(?!\d)')

INJECTION_PATTERNS = [
    r"(?i)ignore previous", r"(?i)system prompt", r"(?i)act as",
    r"(?i)tool_call", r"(?i)BEGIN_INSTRUCTIONS", r"(?i)jailbreak"
]

def redact_pii(text: str) -> str:
    text = PII_EMAIL.sub("[redacted-email]", text)
    text = PII_PHONE.sub("[redacted-phone]", text)
    return text


def detect_prompt_injection(text: str) -> bool:
    return any(re.search(p, text) for p in INJECTION_PATTERNS)  
