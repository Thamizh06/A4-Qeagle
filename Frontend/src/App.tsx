import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SystemMetrics } from './components/SystemMetrics';
import { apiService } from './services/api';
import { AlertCircle, Sparkles } from 'lucide-react';
import type { Profile, Preferences, AdviseResponse, AdviseRequest } from './types';

function App() {
  const [results, setResults] = useState<AdviseResponse | null>(null);
  const [request, setRequest] = useState<AdviseRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async (profile: Profile, preferences: Preferences) => {
    setLoading(true);
    setError(null);
    
    const adviseRequest: AdviseRequest = { profile, prefs: preferences };
    
    try {
      const response = await apiService.getAdvice(adviseRequest);
      setResults(response);
      setRequest(adviseRequest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get advice');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setResults(null);
    setRequest(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!results ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                AI-Powered Career Advisor
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Get personalized learning paths tailored to your skills and career goals. 
                Our AI analyzes your current abilities and recommends the perfect courses to reach your target role.
              </p>
            </div>

            {/* Responsive Grid Layout */}
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-1 xl:grid-cols-3 lg:gap-6 xl:gap-8">
              {/* Profile Form - Full width on mobile/tablet, 2/3 on xl screens */}
              <div className="xl:col-span-2">
                <ProfileForm onSubmit={handleGetAdvice} loading={loading} />
              </div>
              
              {/* System Metrics - Full width on mobile/tablet, 1/3 on xl screens */}
              <div className="xl:col-span-1">
                <SystemMetrics />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Request Failed</h4>
                  <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
                  <p className="text-red-600 text-xs sm:text-sm mt-2">
                    Please check that your backend server is running on http://localhost:8000
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Learning Path Results</h1>
              <button
                onClick={handleStartOver}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 self-start sm:self-auto"
              >
                <span>←</span>
                <span>Start Over</span>
              </button>
            </div>
            
            {/* Results Display */}
            {request && <ResultsDisplay results={results} request={request} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;