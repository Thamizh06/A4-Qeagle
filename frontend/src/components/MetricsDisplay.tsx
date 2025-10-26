import React from 'react';
import { BarChart3, Target, Layers } from 'lucide-react';
import type { Metrics } from '../types';

interface MetricsDisplayProps {
  metrics: Metrics;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  const coveragePercentage = Math.round(metrics.coverage * 100);
  const diversityPercentage = Math.round(metrics.diversity * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Plan Quality Metrics</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered analysis of your learning path</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Skill Coverage</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Target role alignment</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${coveragePercentage}%` }}
                >
                  <span className="text-sm font-bold text-white">
                    {coveragePercentage}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Percentage of target role skills covered by this learning path
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Path Diversity</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Skill variety score</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${diversityPercentage}%` }}
                >
                  <span className="text-sm font-bold text-white">
                    {diversityPercentage}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Variety of skills covered across courses (less redundancy)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6 border-l-4 border-emerald-400 dark:border-emerald-500">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mt-0.5">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h5 className="font-semibold text-slate-900 dark:text-white mb-2">AI Quality Assessment</h5>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {coveragePercentage >= 80 && diversityPercentage >= 80 && "Excellent plan! High coverage with diverse skills."}
              {coveragePercentage >= 60 && coveragePercentage < 80 && "Good plan with solid skill coverage."}
              {coveragePercentage < 60 && "Consider additional courses for better role preparation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};