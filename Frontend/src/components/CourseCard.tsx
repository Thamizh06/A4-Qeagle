import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, ChevronRight, ExternalLink } from 'lucide-react';
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
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-red-600">Failed to load course details</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600">Course ID: {course.course_id}</p>
              </div>
            </div>
            
            {sequence && (
              <div className="mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  <Clock className="w-3 h-3" />
                  Weeks {sequence[1]}-{sequence[2]}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-3">
              <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration_weeks} weeks
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <strong>Why this course:</strong> {planItem.why}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills You'll Gain:</h4>
            <div className="flex flex-wrap gap-1">
              {course.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {course.prerequisites.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</h4>
              <div className="flex flex-wrap gap-1">
                {course.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            {expanded ? 'Show Less' : 'Show More Details'}
            <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>

          {expanded && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Learning Outcomes:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {course.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>

              {planItem.citations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation Sources:</h4>
                  <div className="space-y-1">
                    {planItem.citations.slice(0, 3).map((citation, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-mono">{citation.source_id}</span>
                        <span className="mx-2">•</span>
                        <span>Score: {citation.score.toFixed(3)}</span>
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