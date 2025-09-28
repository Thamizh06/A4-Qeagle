import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { Skill } from '../types';

interface SkillInputProps {
  skills: Skill;
  onChange: (skills: Skill) => void;
}

const commonSkills = [
  'python', 'pytest', 'selenium', 'locators', 'git', 'api', 'http', 'sql', 'docker',
  'ci', 'oop', 'playwright', 'appium', 'performance', 'security_testing', 'mobile'
];

export const SkillInput: React.FC<SkillInputProps> = ({ skills, onChange }) => {
  const addSkill = (skillName: string, level: number = 1) => {
    onChange({
      ...skills,
      [skillName]: level
    });
  };

  const updateSkillLevel = (skillName: string, level: number) => {
    if (level <= 0) {
      const { [skillName]: _, ...rest } = skills;
      onChange(rest);
    } else {
      onChange({
        ...skills,
        [skillName]: Math.min(level, 3)
      });
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-300';
      case 3: return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {commonSkills.filter(skill => !skills[skill]).map(skill => (
          <button
            key={skill}
            onClick={() => addSkill(skill)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            {skill}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {Object.entries(skills).map(([skillName, level]) => (
          <div key={skillName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{skillName}</span>
              <span className={`px-2 py-1 text-xs rounded-full border ${getLevelColor(level)}`}>
                {getLevelLabel(level)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSkillLevel(skillName, level - 1)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-6 text-center font-semibold text-gray-700">{level}</span>
              <button
                onClick={() => updateSkillLevel(skillName, level + 1)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};