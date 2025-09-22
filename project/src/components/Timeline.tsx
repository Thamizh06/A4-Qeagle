import React from 'react';
import { UpskillPlan } from '../types';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

interface TimelineProps {
  timeline: UpskillPlan['timeline'];
}

export default function Timeline({ timeline }: TimelineProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">📅</span>
        </div>
        Learning Timeline
      </h3>

      {/* Timeline Overview */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 mb-6 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Total Duration: {timeline.total_weeks} weeks</span>
        </div>
        <p className="text-green-700 text-sm">
          Complete your transformation in approximately {Math.ceil(timeline.total_weeks / 4)} months
        </p>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {timeline.phases.map((phase, index) => (
          <div key={index} className="relative">
            {/* Timeline Line */}
            {index < timeline.phases.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent"></div>
            )}
            
            <div className="flex items-start gap-4">
              {/* Timeline Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
              </div>

              {/* Phase Content */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{phase.course}</h4>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{phase.weeks}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Key Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.focus.map((focus, focusIndex) => (
                      <span
                        key={focusIndex}
                        className="px-2 py-1 bg-white text-gray-700 rounded border border-gray-300 text-xs"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3" />
                  <span>Phase {index + 1} of {timeline.phases.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Milestone */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎉</span>
          </div>
          <div>
            <p className="font-semibold text-purple-900">Congratulations!</p>
            <p className="text-sm text-purple-700">
              You'll be ready for your target role as a <strong>{timeline.phases[0]?.course.includes('SDET') ? 'SDET' : 'specialized professional'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}