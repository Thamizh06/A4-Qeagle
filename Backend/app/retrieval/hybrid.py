# app/retrieval/hybrid.py
from typing import List, Dict
from app.models import RetrievedDoc
from app.config import settings
from langchain.retrievers import EnsembleRetriever
from sentence_transformers import CrossEncoder  # reranker. :contentReference[oaicite:14]{index=14}

def build_hybrid_retriever(bm25_retriever, vectorstore):
    dense = vectorstore.as_retriever(search_kwargs={"k": settings.TOP_K_VECTOR})
    bm25_retriever.k = settings.TOP_K_BM25
    # Ensemble fusion (weighted sum). 
    return EnsembleRetriever(retrievers=[dense, bm25_retriever], weights=[0.5, 0.5])

def rerank(query: str, docs, topn: int = 10) -> List[RetrievedDoc]:
    # Cross-encoder scores the pair (query, doc)
    model = CrossEncoder(settings.CROSS_ENCODER_MODEL)
    pairs = [(query, d.page_content) for d in docs]
    scores = model.predict(pairs)
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)[:topn]
    out: List[RetrievedDoc] = []
    for doc, s in ranked:
        meta = dict(doc.metadata)
        out.append(RetrievedDoc(
            source_id=meta.get("source_id", ""),
            text=doc.page_content,
            meta=meta,
            score=float(s)
        ))
    return out
