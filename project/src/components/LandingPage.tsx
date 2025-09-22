import React, { useState } from 'react';
import { UserProfile } from '../types';
import { availableSkills } from '../data/mockData';
import { ChevronDown, Plus, X, Target, Clock, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onGeneratePlan: (profile: UserProfile) => void;
}

export default function LandingPage({ onGeneratePlan }: LandingPageProps) {
  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    years: 0,
    goal_role: ''
  });
  
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !profile.skills.includes(skill)
  );

  const addSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.skills.length > 0 && profile.goal_role.trim()) {
      onGeneratePlan(profile);
    }
  };

  const targetRoles = ['SDET', 'GenAI QA Engineer', 'Performance Test Engineer', 'Mobile QA Engineer', 'Automation Test Engineer', 'QA Lead'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upskilling Advisor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized course recommendations and a clear roadmap to achieve your career goals
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skills Section */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Current Skills *
                </label>
                
                {/* Selected Skills */}
                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                    {profile.skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skills Dropdown */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and add skills..."
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSkills.slice(0, 10).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Years of Experience */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-900">
                    Years of Experience *
                  </label>
                  <select
                    value={profile.years}
                    onChange={(e) => setProfile(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    required
                  >
                    <option value={0}>Select experience</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>{i === 0 ? 'Fresher' : i === 10 ? '10+ years' : `${i} year${i > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>

                {/* Target Role */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-900">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    list="roles"
                    placeholder="e.g., SDET, GenAI QA"
                    value={profile.goal_role}
                    onChange={(e) => setProfile(prev => ({ ...prev, goal_role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <datalist id="roles">
                    {targetRoles.map(role => <option key={role} value={role} />)}
                  </datalist>
                </div>
              </div>

              {/* Optional Preferences */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Optional Preferences</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Duration Limit (weeks)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 12"
                      min="1"
                      max="52"
                      value={profile.duration_limit || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        duration_limit: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Difficulty Preference
                    </label>
                    <select
                      value={profile.difficulty_preference || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        difficulty_preference: e.target.value as any || undefined 
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">Any difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={profile.skills.length === 0 || !profile.goal_role.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-lg font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                🚀 Generate My Upskilling Plan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}