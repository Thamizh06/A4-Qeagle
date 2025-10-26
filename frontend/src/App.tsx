import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
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
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {!results ? (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Career Advisor
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Get personalized learning paths tailored to your skills and career goals. 
                  Our AI analyzes your current abilities and recommends the perfect courses to reach your target role.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ProfileForm onSubmit={handleGetAdvice} loading={loading} />
                </div>
                <div>
                  <SystemMetrics />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Request Failed</h4>
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      Please check that your backend server is running on http://localhost:8000
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            request && <ResultsDisplay results={results} request={request} onStartOver={handleStartOver} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;