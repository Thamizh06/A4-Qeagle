import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Timeline } from '../types';

interface TimelinePlanProps {
  timeline: Timeline;
}

export const TimelinePlan: React.FC<TimelinePlanProps> = ({ timeline }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Learning Timeline</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Total Duration:</span>
            <span className="text-blue-600 font-semibold">{timeline.weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Courses:</span>
            <span className="text-teal-600 font-semibold">{timeline.sequence.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {timeline.sequence.map(([courseId, startWeek, endWeek], index) => (
          <div key={courseId} className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{courseId}</h4>
                  <p className="text-sm text-gray-600">
                    Weeks {startWeek}-{endWeek} • {endWeek - startWeek + 1} weeks duration
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    Week {startWeek}
                  </div>
                  <div className="text-xs text-gray-500">
                    Start Date
                  </div>
                </div>
              </div>
              
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                  style={{
                    width: `${((endWeek - startWeek + 1) / timeline.weeks) * 100}%`
                  }}
                />
              </div>
            </div>
            
            {index < timeline.sequence.length - 1 && (
              <div className="absolute left-8 mt-12 w-px h-6 bg-gray-300" style={{ marginLeft: '15px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};