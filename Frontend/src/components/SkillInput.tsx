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
      case 1: return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 2: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 3: return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {commonSkills.filter(skill => !skills[skill]).map(skill => (
          <button
            key={skill}
            type="button"
            onClick={() => addSkill(skill)}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 flex items-center gap-2 border border-gray-200 dark:border-gray-600 hover:border-primary shadow-sm hover:shadow-lg"
          >
            <Plus className="w-3 h-3" />
            {skill}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {Object.entries(skills).map(([skillName, level]) => (
          <div key={skillName} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 dark:text-white capitalize">{skillName}</span>
              <span className={`px-2 py-1 text-xs rounded-full border ${getLevelColor(level)}`}>
                {getLevelLabel(level)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateSkillLevel(skillName, level - 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="w-8 text-center font-bold text-gray-700 dark:text-gray-300 text-lg">{level}</span>
              <button
                type="button"
                onClick={() => updateSkillLevel(skillName, level + 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};