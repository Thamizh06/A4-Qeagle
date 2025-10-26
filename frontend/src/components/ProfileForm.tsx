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
    if (Object.keys(profile.skills).length === 0 || !profile.goal_role) {
      alert('Please add at least one skill and select a goal role');
      return;
    }
    onSubmit(profile, preferences);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Profile</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Tell us about your current skills and goals</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Target className="w-4 h-4" />
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={profile.years}
              onChange={(e) => setProfile({ ...profile, years: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Settings className="w-4 h-4" />
              Max Learning Duration (weeks)
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={preferences.max_weeks}
              onChange={(e) => setPreferences({ ...preferences, max_weeks: parseInt(e.target.value) || 14 })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Target className="w-4 h-4" />
            Goal Role
          </label>
          <select
            value={profile.goal_role}
            onChange={(e) => setProfile({ ...profile, goal_role: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="">Select your target role...</option>
            {goalRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4" />
            Current Skills
          </label>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Add your current skills and rate your proficiency level (1-3)
          </p>
          <SkillInput
            skills={profile.skills}
            onChange={(skills) => setProfile({ ...profile, skills })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || Object.keys(profile.skills).length === 0 || !profile.goal_role}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <LoadingSpinner className="text-white" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {loading ? 'AI is analyzing your profile...' : 'Generate My Learning Path'}
        </button>
      </form>
    </div>
  );
};