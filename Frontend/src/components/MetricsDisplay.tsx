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
        <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-purple">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Plan Quality Metrics</h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">AI-powered analysis of your learning path</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-purple">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
                <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900 dark:text-white">Skill Coverage</h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Target role alignment</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-secondary-200 dark:bg-secondary-700 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${coveragePercentage}%` }}
                >
                  <span className="text-sm font-bold text-white">
                    {coveragePercentage}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Percentage of target role skills covered by this learning path
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-purple">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-50 dark:bg-accent-900/30 rounded-lg border border-accent-200 dark:border-accent-800">
                <Layers className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h4 className="font-semibold text-secondary-900 dark:text-white">Path Diversity</h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Skill variety score</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-secondary-200 dark:bg-secondary-700 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-accent-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${diversityPercentage}%` }}
                >
                  <span className="text-sm font-bold text-white">
                    {diversityPercentage}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Variety of skills covered across courses (less redundancy)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6 border-l-4 border-primary-400 dark:border-primary-500 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mt-0.5 border border-primary-200 dark:border-primary-800">
            <BarChart3 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h5 className="font-semibold text-secondary-900 dark:text-white mb-2">AI Quality Assessment</h5>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
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