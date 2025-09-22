import React from 'react';
import { UpskillPlan, UserProfile } from '../types';
import CourseCard from './CourseCard';
import SkillGapMap from './SkillGapMap';
import Timeline from './Timeline';
import { Download, ArrowLeft, Award, TrendingUp, Clock } from 'lucide-react';

interface DashboardProps {
  plan: UpskillPlan;
  profile: UserProfile;
  onBack: () => void;
}

export default function Dashboard({ plan, profile, onBack }: DashboardProps) {
  const handleDownloadPDF = () => {
    // Mock PDF generation - in real implementation would generate actual PDF
    const content = `
      UPSKILLING PLAN
      
      Profile: ${profile.goal_role}
      Skills: ${profile.skills.join(', ')}
      Experience: ${profile.years} years
      
      Recommended Courses:
      ${plan.recommendations.map((rec, i) => `
      ${i + 1}. ${rec.course.title}
         Duration: ${rec.course.duration_weeks} weeks
         Why: ${rec.why}
      `).join('')}
      
      Skill Coverage: ${plan.coverage_score}%
      Total Duration: ${plan.timeline.total_weeks} weeks
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upskilling-plan-${profile.goal_role.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-gray-200 hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Upskilling Plan</h1>
              <p className="text-gray-600 mt-1">
                Personalized roadmap for <span className="font-semibold text-blue-600">{profile.goal_role}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Plan
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Skill Coverage</p>
                <p className="text-2xl font-bold text-green-600">{plan.coverage_score}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-blue-600">{plan.timeline.total_weeks} weeks</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-purple-600">{plan.recommendations.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📚</span>
                </div>
                Recommended Learning Path
              </h2>
              <div className="space-y-4">
                {plan.recommendations.map((recommendation, index) => (
                  <CourseCard
                    key={recommendation.course.course_id}
                    course={recommendation.course}
                    why={recommendation.why}
                    step={index + 1}
                  />
                ))}
              </div>
            </section>

            <section>
              <Timeline timeline={plan.timeline} />
            </section>
          </div>

          {/* Right Column - Skill Gap and Notes */}
          <div className="space-y-8">
            <SkillGapMap skillGaps={plan.skill_gaps} />
            
            {/* Additional Notes */}
            {plan.notes && plan.notes.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  💡 Key Insights
                </h3>
                <ul className="space-y-3">
                  {plan.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}