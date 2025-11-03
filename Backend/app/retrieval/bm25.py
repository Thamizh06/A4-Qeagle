# app/retrieval/bm25.py
from typing import List, Dict
from dataclasses import dataclass
from rank_bm25 import BM25Okapi
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from langchain_core.pydantic_v1 import PrivateAttr  # <-- pydantic v1 private attr

def _tokenize(text: str) -> List[str]:
    return text.lower().split()

@dataclass
class _BM25Store:
    docs: List[Document]
    bm25: BM25Okapi

class SimpleBM25Retriever(BaseRetriever):
    """Minimal BM25 retriever compatible with LangChain BaseRetriever."""
    k: int = 20
    _store: _BM25Store = PrivateAttr()  # <-- declare private field

    def __init__(self, docs: List[Document], k: int = 20, **kwargs):
        super().__init__(k=k, **kwargs)
        self._store = self._build(docs)

    def _build(self, docs: List[Document]) -> _BM25Store:
        tokenized = [_tokenize(d.page_content) for d in docs]
        return _BM25Store(docs=docs, bm25=BM25Okapi(tokenized))

    def _get_relevant_documents(self, query: str) -> List[Document]:
        scores = self._store.bm25.get_scores(_tokenize(query))
        ranked = sorted(zip(self._store.docs, scores), key=lambda x: x[1], reverse=True)[: self.k]
        out = []
        for d, s in ranked:
            md = dict(d.metadata)
            md["bm25_score"] = float(s)
            out.append(Document(page_content=d.page_content, metadata=md))
        return out

def build_bm25(docs: List[Dict]) -> SimpleBM25Retriever:
    lc_docs = [Document(page_content=d["text"], metadata=d["meta"]) for d in docs]
    return SimpleBM25Retriever(lc_docs, k=20)
