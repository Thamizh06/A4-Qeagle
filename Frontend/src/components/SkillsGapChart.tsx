import React from 'react';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import type { GapMap, Profile } from '../types';

interface SkillsGapChartProps {
  gapMap: GapMap;
  currentSkills: Profile['skills'];
}

export const SkillsGapChart: React.FC<SkillsGapChartProps> = ({ gapMap, currentSkills }) => {
  const skillsData = Object.keys(gapMap).map(skill => ({
    skill,
    current: currentSkills[skill] || 0,
    required: (currentSkills[skill] || 0) + gapMap[skill],
    gap: gapMap[skill]
  }));

  const maxLevel = Math.max(...skillsData.map(s => s.required));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary rounded-xl shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skills Gap Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current vs Required Skill Levels</p>
        </div>
      </div>

      {skillsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-green-200 dark:border-green-800">
            <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Perfect Match!</h4>
          <p className="text-gray-600 dark:text-gray-400">No skills gaps identified. You're well-prepared for your target role.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {skillsData.map(({ skill, current, required, gap }) => (
            <div key={skill} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{skill}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gap:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    gap === 1 ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700' :
                    gap === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    +{gap}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{current}/3</span>
                </div>
                
                <div className="relative">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${(current / maxLevel) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500 transition-all duration-1000 ease-out"
                        style={{ width: `${(gap / maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white mix-blend-difference">
                      {current} → {required}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Target Level</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{required}/3</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};