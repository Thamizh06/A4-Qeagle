import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import type { HealthResponse } from '../types';

export const Header: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthData = await apiService.getHealth();
        setHealth(healthData);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Career Advisor</h1>
              <p className="text-sm text-gray-600">Personalized Learning Path Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">System Status:</span>
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className={`text-sm font-medium ${health?.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {health?.ok ? 'Online' : 'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};