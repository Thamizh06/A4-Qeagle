import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, ChevronRight, Star, Users } from 'lucide-react';
import { apiService } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import type { Course, PlanItem } from '../types';

interface CourseCardProps {
  planItem: PlanItem;
  sequence?: [string, number, number];
}

export const CourseCard: React.FC<CourseCardProps> = ({ planItem, sequence }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await apiService.getCourse(planItem.course_id);
        setCourse(courseData);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [planItem.course_id]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <p className="text-red-600 dark:text-red-400">Failed to load course details</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'intermediate': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Course ID: {course.course_id}</p>
              </div>
            </div>
            
            {sequence && (
              <div className="mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                  <Clock className="w-3 h-3" />
                  Weeks {sequence[1]}-{sequence[2]}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-3">
              <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration_weeks} weeks
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs text-slate-600 dark:text-slate-400">4.8</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border-l-4 border-amber-400 dark:border-amber-500">
                <strong>Why this course:</strong> {planItem.why}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skills You'll Gain:</h4>
            <div className="flex flex-wrap gap-1">
              {course.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {course.prerequisites.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prerequisites:</h4>
              <div className="flex flex-wrap gap-1">
                {course.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-semibold transition-colors duration-200"
          >
            {expanded ? 'Show Less' : 'Show More Details'}
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Learning Outcomes:
                </h4>
                <ul className="space-y-2">
                  {course.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {planItem.citations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Recommendation Sources:</h4>
                  <div className="space-y-2">
                    {planItem.citations.slice(0, 3).map((citation, index) => (
                      <div key={index} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                        <span className="font-mono font-semibold">{citation.source_id}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Score: {citation.score.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};