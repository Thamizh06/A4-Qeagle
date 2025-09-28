import React, { useState } from 'react';
import { User, Target, Settings, Sparkles } from 'lucide-react';
import { SkillInput } from './SkillInput';
import { LoadingSpinner } from './LoadingSpinner';
import type { Profile, Preferences } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: Profile, preferences: Preferences) => void;
  loading: boolean;
}

const goalRoles = [
  'SDET (Web UI)',
  'SDET (API)',
  'Automation Test Engineer',
  'E2E Engineer (Playwright)',
  'API QA Engineer',
  'Performance QA',
  'Security QA',
  'Mobile QA (Appium)',
  'QA Lead',
  'DevTest Engineer',
  'Data/ETL QA',
  'GenAI QA (RAG)',
  'GenAI QA (Production Observability)',
  'Platform QA (CI/CD)'
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, loading }) => {
  const [profile, setProfile] = useState<Profile>({
    skills: {},
    years: 1,
    goal_role: ''
  });
  
  const [preferences, setPreferences] = useState<Preferences>({
    max_weeks: 14
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (Object.keys(profile.skills).length === 0 || !profile.goal_role) {
      alert('Please add at least one skill and select a goal role');
      return;
    }
    onSubmit(profile, preferences);
  };

  const handleSkillsChange = (skills: typeof profile.skills) => {
    setProfile(prev => ({ ...prev, skills }));
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (Object.keys(profile.skills).length === 0 || !profile.goal_role) {
      alert('Please add at least one skill and select a goal role');
      return;
    }
    onSubmit(profile, preferences);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Create Your Profile</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Target className="w-4 h-4" />
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={profile.years}
              onChange={(e) => {
                e.stopPropagation();
                setProfile(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings className="w-4 h-4" />
              Max Learning Duration (weeks)
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={preferences.max_weeks}
              onChange={(e) => {
                e.stopPropagation();
                setPreferences(prev => ({ ...prev, max_weeks: parseInt(e.target.value) || 14 }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Target className="w-4 h-4" />
            Goal Role
          </label>
          <select
            value={profile.goal_role}
            onChange={(e) => {
              e.stopPropagation();
              setProfile(prev => ({ ...prev, goal_role: e.target.value }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">Select your target role...</option>
            {goalRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4" />
            Current Skills
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Add your current skills and rate your proficiency level (1-3)
          </p>
          <SkillInput
            skills={profile.skills}
            onChange={handleSkillsChange}
          />
        </div>

        <button
          type="button"
          disabled={loading || Object.keys(profile.skills).length === 0 || !profile.goal_role}
          onClick={handleButtonClick}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {loading ? (
            <LoadingSpinner className="text-white" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {loading ? 'Generating Your  Path...' : 'Get My Path'}
        </button>
      </div>
    </div>
  );
};