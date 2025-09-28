import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { apiService } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import type { MetricsResponse } from '../types';

export const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsData = await apiService.getMetrics();
        setMetrics(metricsData);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="text-purple-600" />
          <p className="text-sm text-gray-600">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-600">Failed to load system metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex-shrink-0">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">System Performance</h2>
      </div>

      {/* Metrics Grid - Responsive layout */}
      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4">
        {/* Total Requests */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1 sm:p-1.5 bg-blue-500 rounded-md">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">TOTAL</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-blue-900">
              {metrics.requests.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">Requests</div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-1 sm:p-1.5 rounded-md ${
              metrics.non_200_rate === 0 ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {metrics.non_200_rate === 0 ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              ) : (
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              )}
            </div>
            <span className="text-xs text-green-600 font-medium">ERROR</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-green-900">
              {(metrics.non_200_rate * 100).toFixed(1)}%
            </div>
            <div className="text-xs sm:text-sm text-green-700">Rate</div>
          </div>
        </div>

        {/* P95 Latency */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1 sm:p-1.5 bg-orange-500 rounded-md">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-medium">P95</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-orange-900">
              {(metrics.p95_latency_sec * 1000).toFixed(0)}ms
            </div>
            <div className="text-xs sm:text-sm text-orange-700">Latency</div>
          </div>
        </div>

        {/* Average Latency */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 sm:p-4 border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1 sm:p-1.5 bg-teal-500 rounded-md">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-xs text-teal-600 font-medium">AVG</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-teal-900">
              {(metrics.avg_latency_sec * 1000).toFixed(0)}ms
            </div>
            <div className="text-xs sm:text-sm text-teal-700">Latency</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-400">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-green-100 rounded-full mt-0.5 flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">System Status: Online</h5>
            <p className="text-xs sm:text-sm text-gray-600">
              Metrics updated automatically every 30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};