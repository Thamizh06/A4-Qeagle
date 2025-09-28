import React, { useState } from 'react';
import { Download, BookOpen, AlertCircle } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { SkillsGapMap } from './SkillsGapMap';
import { TimelinePlan } from './TimelinePlan';
import { MetricsDisplay } from './MetricsDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';
import type { AdviseResponse, AdviseRequest } from '../types';

interface ResultsDisplayProps {
  results: AdviseResponse;
  request: AdviseRequest;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, request }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Personalized Learning Path</h2>
            <p className="text-blue-100">
              Target Role: <span className="font-semibold">{request.profile.goal_role}</span>
            </p>
            <p className="text-blue-100 text-sm mt-1">{results.notes}</p>
          </div>
          
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {downloadingPdf ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {downloadingPdf ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <MetricsDisplay metrics={results.metrics} />

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Recommended Courses</h3>
        </div>

        {results.plan.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">No Courses Recommended</h4>
            <p className="text-yellow-700">
              You might already have the skills needed for your target role, or try adjusting your preferences.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.plan.map((planItem, index) => {
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SkillsGapMap gapMap={results.gap_map} />
        <TimelinePlan timeline={results.timeline} />
      </div>
    </div>
  );
};