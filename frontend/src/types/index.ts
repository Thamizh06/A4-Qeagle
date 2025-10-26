export interface Skill {
  [key: string]: number;
}

export interface Profile {
  skills: Skill;
  years: number;
  goal_role: string;
}

export interface Preferences {
  max_weeks?: number;
}

export interface Citation {
  source_id: string;
  span: string;
  score: number;
}

export interface PlanItem {
  course_id: string;
  why: string;
  citations: Citation[];
}

export interface GapMap {
  [skill: string]: number;
}

export interface Timeline {
  weeks: number;
  sequence: [string, number, number][];
}

export interface Metrics {
  coverage: number;
  diversity: number;
}

export interface AdviseResponse {
  plan: PlanItem[];
  gap_map: GapMap;
  timeline: Timeline;
  notes: string;
  metrics: Metrics;
}

export interface Course {
  course_id: string;
  title: string;
  skills: string[];
  difficulty: string;
  duration_weeks: number;
  prerequisites: string[];
  outcomes: string[];
}

export interface HealthResponse {
  ok: boolean;
}

export interface MetricsResponse {
  requests: number;
  non_200_rate: number;
  p95_latency_sec: number;
  avg_latency_sec: number;
}

export interface AdviseRequest {
  profile: Profile;
  prefs: Preferences;
}