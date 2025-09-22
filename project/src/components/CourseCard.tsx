import React from 'react';
import { Course } from '../types';
import { Clock, BarChart3, Star, ChevronRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  why: string;
  step: number;
}

export default function CourseCard({ course, why, step }: CourseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
              {step}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{course.duration_weeks} weeks</span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{course.description}</p>

        {/* Why This Course */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            Why this course?
          </h4>
          <p className="text-blue-800">{why}</p>
        </div>

        {/* Skills You'll Learn */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            Skills you'll gain
          </h4>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">Learning outcomes</h4>
          <ul className="space-y-2">
            {course.outcomes.slice(0, 3).map((outcome, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        {course.prerequisites.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Prerequisites</h4>
            <div className="flex flex-wrap gap-1">
              {course.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}