import React from 'react';
import { SkillGap } from '../types';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface SkillGapMapProps {
  skillGaps: SkillGap[];
}

export default function SkillGapMap({ skillGaps }: SkillGapMapProps) {
  const getGapIcon = (gap: string) => {
    switch (gap) {
      case 'None': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Small': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'Medium': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'Large': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'None': return 'bg-green-100 text-green-800 border-green-200';
      case 'Small': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Large': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'None': return 'text-gray-400';
      case 'Basic': return 'text-blue-600';
      case 'Intermediate': return 'text-purple-600';
      case 'Advanced': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🧩</span>
        </div>
        Skill Gap Analysis
      </h3>

      <div className="space-y-4">
        {skillGaps.map((skillGap, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{skillGap.skill}</h4>
              {getGapIcon(skillGap.gap)}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-gray-500">Current</p>
                  <p className={`font-semibold ${getLevelColor(skillGap.current_level)}`}>
                    {skillGap.current_level}
                  </p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-center">
                  <p className="text-gray-500">Required</p>
                  <p className={`font-semibold ${getLevelColor(skillGap.required_level)}`}>
                    {skillGap.required_level}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getGapColor(skillGap.gap)}`}>
                {skillGap.gap} Gap
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>
                  {skillGap.gap === 'None' ? '100%' : 
                   skillGap.gap === 'Small' ? '75%' : 
                   skillGap.gap === 'Medium' ? '50%' : '25%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    skillGap.gap === 'None' ? 'bg-green-500 w-full' :
                    skillGap.gap === 'Small' ? 'bg-yellow-500 w-3/4' :
                    skillGap.gap === 'Medium' ? 'bg-orange-500 w-1/2' : 'bg-red-500 w-1/4'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">
              {skillGaps.filter(sg => sg.gap === 'None').length}
            </p>
            <p className="text-xs text-green-700">Skills Ready</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-orange-600">
              {skillGaps.filter(sg => sg.gap !== 'None').length}
            </p>
            <p className="text-xs text-orange-700">Need Improvement</p>
          </div>
        </div>
      </div>
    </div>
  );
}