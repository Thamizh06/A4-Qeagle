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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Plan Quality Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-gray-900">Skill Coverage</h4>
          </div>
          
          <div className="relative">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${coveragePercentage}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white mix-blend-difference">
                {coveragePercentage}%
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Percentage of target role skills covered by this learning path
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <h4 className="font-medium text-gray-900">Path Diversity</h4>
          </div>
          
          <div className="relative">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${diversityPercentage}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white mix-blend-difference">
                {diversityPercentage}%
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Variety of skills covered across courses (less redundancy)
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-400">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-green-100 rounded-full mt-0.5">
            <BarChart3 className="w-3 h-3 text-green-600" />
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Quality Assessment</h5>
            <p className="text-sm text-gray-700">
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