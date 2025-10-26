import React, { useState } from 'react';
import { Download, AlertCircle, ArrowLeft } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { SkillsGapChart } from './SkillsGapChart';
import { TimelineChart } from './TimelineChart';
import { MetricsDisplay } from './MetricsDisplay';
import { TabNavigation } from './TabNavigation';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';
import type { AdviseResponse, AdviseRequest } from '../types';

interface ResultsDisplayProps {
  results: AdviseResponse;
  request: AdviseRequest;
  onStartOver: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, request, onStartOver }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const pdfBlob = await apiService.downloadPdf(request);
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `learning-plan-${request.profile.goal_role.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            {results.plan.length === 0 ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">No Courses Recommended</h4>
                <p className="text-amber-700 dark:text-amber-400">
                  You might already have the skills needed for your target role, or try adjusting your preferences.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.plan.map((planItem) => {
                  const sequence = results.timeline.sequence.find(seq => seq[0] === planItem.course_id);
                  return (
                    <CourseCard
                      key={planItem.course_id}
                      planItem={planItem}
                      sequence={sequence}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'timeline':
        return <TimelineChart timeline={results.timeline} />;
      case 'skills':
        return <SkillsGapChart gapMap={results.gap_map} currentSkills={request.profile.skills} />;
      case 'metrics':
        return <MetricsDisplay metrics={results.metrics} />;
      default:
        return null;
    }
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={onStartOver}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-3xl font-bold">Your AI-Generated Learning Path</h2>
                <p className="text-white/90 text-lg mt-1">Personalized for your career goals</p>
              </div>
            </div>
            <p className="text-blue-100">
              Target Role: <span className="font-bold text-white">{request.profile.goal_role}</span>
            </p>
            <p className="text-blue-100 text-sm mt-2 max-w-2xl">{results.notes}</p>
          </div>
          
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 hover:scale-105"
          >
            {downloadingPdf ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        coursesCount={results.plan.length}
      />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};