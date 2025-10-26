import React from 'react';
import { Calendar, Clock, Play, CheckCircle } from 'lucide-react';
import type { Timeline } from '../types';

interface TimelineChartProps {
  timeline: Timeline;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ timeline }) => {
  const weeks = Array.from({ length: timeline.weeks }, (_, i) => i + 1);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary rounded-xl shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your personalized study schedule</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{timeline.weeks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Weeks</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <Play className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{timeline.sequence.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(timeline.weeks / timeline.sequence.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Date(Date.now() + timeline.weeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Target Date</div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Professional Learning Schedule</h4>
          
          {/* Week Headers */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <div className="w-48 flex-shrink-0"></div>
            {weeks.map(week => (
              <div key={week} className="w-8 text-center text-xs font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                W{week}
              </div>
            ))}
          </div>

          {/* Course Rows */}
          <div className="space-y-3">
            {timeline.sequence.map(([courseId, startWeek, endWeek], index) => (
              <div key={courseId} className="flex items-center gap-2">
                <div className="w-48 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{courseId}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {endWeek - startWeek + 1} weeks
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto">
                  {weeks.map(week => (
                    <div key={week} className="w-8 h-6 flex-shrink-0">
                      {week >= startWeek && week <= endWeek && (
                        <div className={`h-full rounded ${
                          week === startWeek ? 'rounded-l-lg' : ''
                        } ${
                          week === endWeek ? 'rounded-r-lg' : ''
                        } ${
                          index % 4 === 0 ? 'bg-primary' :
                          index % 4 === 1 ? 'bg-blue-500' :
                          index % 4 === 2 ? 'bg-green-500' :
                          'bg-yellow-500'
                        } shadow-sm opacity-80`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};