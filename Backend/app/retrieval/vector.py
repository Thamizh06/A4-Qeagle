# app/retrieval/vector.py
from typing import List, Dict
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings 
from pinecone import Pinecone, ServerlessSpec
from app.config import settings

def get_embeddings():
    return HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)

def ensure_pinecone_index(dim: int = 384):
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    existing = [i.name for i in pc.list_indexes()]
    if settings.PINECONE_INDEX not in existing:
        pc.create_index(
            name=settings.PINECONE_INDEX,
            dimension=dim,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    return pc

def build_vectorstore(docs: List[Dict]) -> PineconeVectorStore:
    ensure_pinecone_index()
    emb = get_embeddings()
    texts = [d["text"] for d in docs]
    metadatas = [d["meta"] for d in docs]
    return PineconeVectorStore.from_texts(
        texts=texts,
        embedding=emb,             # <-- corrected
        index_name=settings.PINECONE_INDEX,
        metadatas=metadatas
    )
