import time, statistics, uuid
from typing import Dict

class Metrics:
    def __init__(self):
        self.latencies = []  # seconds
        self.errors = 0
        self.requests = 0

    def start(self):
        self.requests += 1
        return time.perf_counter()

    def end(self, t0):
        dt = time.perf_counter() - t0
        self.latencies.append(dt)
        return dt

    def error(self):
        self.errors += 1

    def snapshot(self) -> Dict:
        lat = self.latencies[-200:]  # recent window
        p95 = statistics.quantiles(lat, n=20)[-1] if len(lat) >= 20 else (max(lat) if lat else 0.0)
        return {
            "requests": self.requests,
            "non_200_rate": (self.errors / self.requests) if self.requests else 0.0,
            "p95_latency_sec": round(p95, 4),
            "avg_latency_sec": round(sum(lat)/len(lat), 4) if lat else 0.0
        }

metrics = Metrics()

def new_trace_id() -> str:
    return uuid.uuid4().hex[:12]
