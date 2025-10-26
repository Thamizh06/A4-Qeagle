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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <p className="text-red-600 dark:text-red-400">Failed to load course details</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-xl shadow-lg transition-shadow duration-300">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">{course.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Course ID: {course.course_id}</p>
              </div>
            </div>
            
            {sequence && (
              <div className="mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-700">
                  <Clock className="w-3 h-3" />
                  Weeks {sequence[1]}-{sequence[2]}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-3">
              <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration_weeks} weeks
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 dark:text-gray-400">4.8</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border-l-4 border-primary">
                <strong>Why this course:</strong> {planItem.why}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills You'll Gain:</h4>
            <div className="flex flex-wrap gap-1">
              {course.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {course.prerequisites.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prerequisites:</h4>
              <div className="flex flex-wrap gap-1">
                {course.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-primary hover:text-primary-light text-sm font-semibold transition-colors duration-200"
          >
            {expanded ? 'Show Less' : 'Show More Details'}
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Learning Outcomes:
                </h4>
                <ul className="space-y-2">
                  {course.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {planItem.citations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recommendation Sources:</h4>
                  <div className="space-y-2">
                    {planItem.citations.slice(0, 3).map((citation, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
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