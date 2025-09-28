import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import type { GapMap } from '../types';

interface SkillsGapMapProps {
  gapMap: GapMap;
}

export const SkillsGapMap: React.FC<SkillsGapMapProps> = ({ gapMap }) => {
  const getGapColor = (level: number) => {
    if (level === 1) return 'bg-green-100 text-green-800 border-green-300';
    if (level === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getGapLabel = (level: number) => {
    if (level === 1) return 'Basic Gap';
    if (level === 2) return 'Moderate Gap';
    return 'Significant Gap';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Skills Gap Analysis</h3>
      </div>

      {Object.keys(gapMap).length === 0 ? (
        <div className="text-center py-8">
          <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">No skills gaps identified! You're well-prepared for your target role.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            These skills need improvement to reach your target role:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(gapMap).map(([skill, level]) => (
              <div
                key={skill}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{skill}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getGapColor(level)}`}>
                    +{level}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{getGapLabel(level)}</p>
                
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      level === 1 ? 'bg-green-500' :
                      level === 2 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((level / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};