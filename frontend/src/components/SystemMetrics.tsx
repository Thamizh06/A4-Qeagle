import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <p className="text-red-600 dark:text-red-400">Failed to load system metrics</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Performance</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Real-time API metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {metrics.requests.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Requests</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center mb-1">
            {metrics.non_200_rate === 0 ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">
            {(metrics.non_200_rate * 100).toFixed(1)}%
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Error Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {(metrics.p95_latency_sec * 1000).toFixed(0)}ms
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">P95 Latency</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {(metrics.avg_latency_sec * 1000).toFixed(0)}ms
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Avg Latency</p>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center">
        Metrics updated automatically every 30 seconds
      </div>
    </div>
  );
};