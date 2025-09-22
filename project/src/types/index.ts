export interface Course {
  course_id: string;
  title: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_weeks: number;
  prerequisites: string[];
  outcomes: string[];
  description: string;
  rating: number;
}

export interface JobDescription {
  role: string;
  required_skills: { [skill: string]: 'Basic' | 'Intermediate' | 'Advanced' };
  experience_years: number;
}

export interface UserProfile {
  skills: string[];
  years: number;
  goal_role: string;
  duration_limit?: number;
  difficulty_preference?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CourseRecommendation {
  course: Course;
  why: string;
}

export interface SkillGap {
  skill: string;
  current_level: 'None' | 'Basic' | 'Intermediate' | 'Advanced';
  required_level: 'Basic' | 'Intermediate' | 'Advanced';
  gap: 'None' | 'Small' | 'Medium' | 'Large';
}

export interface UpskillPlan {
  recommendations: CourseRecommendation[];
  skill_gaps: SkillGap[];
  timeline: {
    total_weeks: number;
    phases: {
      weeks: string;
      course: string;
      focus: string[];
    }[];
  };
  coverage_score: number;
  notes: string[];
}