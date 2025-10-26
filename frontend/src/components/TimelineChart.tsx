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
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Learning Timeline</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Your personalized study schedule</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeline.weeks}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Weeks</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
            <Play className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{timeline.sequence.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Courses</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(timeline.weeks / timeline.sequence.length)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Duration</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {new Date(Date.now() + timeline.weeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Target Date</div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Course Schedule</h4>
          
          {/* Week Headers */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <div className="w-48 flex-shrink-0"></div>
            {weeks.map(week => (
              <div key={week} className="w-8 text-center text-xs font-medium text-slate-600 dark:text-slate-400 flex-shrink-0">
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
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white text-sm">{courseId}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
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
                          index % 4 === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                          index % 4 === 1 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                          index % 4 === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                          'bg-gradient-to-r from-orange-400 to-orange-500'
                        } shadow-sm`} />
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