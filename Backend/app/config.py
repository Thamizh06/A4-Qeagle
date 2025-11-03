# app/config.py
import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

# Look for .env starting from repo root (two levels up from this file)
ROOT = Path(__file__).resolve().parents[1]
env_path = ROOT / ".env"
load_dotenv(dotenv_path=str(env_path) if env_path.exists() else find_dotenv())

class Settings:
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "adb8903f-0ee1-4f9a-9821-6bcd11cebf8e")
    PINECONE_INDEX = os.getenv("PINECONE_INDEX", "upskill-courses")
    PINECONE_HOST = os.getenv("PINECONE_HOST", None)
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    CROSS_ENCODER_MODEL = os.getenv("CROSS_ENCODER_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "")
    TOP_K_VECTOR = int(os.getenv("TOP_K_VECTOR", "20"))
    TOP_K_BM25 = int(os.getenv("TOP_K_BM25", "20"))
    RERANK_TOPN = int(os.getenv("RERANK_TOPN", "50"))
    RETURN_TOP = int(os.getenv("RETURN_TOP", "8"))
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

settings = Settings()
