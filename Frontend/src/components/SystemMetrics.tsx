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
    <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-purple transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-purple">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white">System Performance</h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Real-time API metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
            {metrics.requests.toLocaleString()}
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Requests</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center mb-1">
            {metrics.non_200_rate === 0 ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="text-lg font-bold text-secondary-700 dark:text-secondary-300 mb-1">
            {(metrics.non_200_rate * 100).toFixed(1)}%
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Error Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-4 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl border border-accent-200 dark:border-accent-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <span className="text-lg font-bold text-accent-600 dark:text-accent-400">
              {(metrics.p95_latency_sec * 1000).toFixed(0)}ms
            </span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">P95 Latency</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {(metrics.avg_latency_sec * 1000).toFixed(0)}ms
            </span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Avg Latency</p>
        </div>
      </div>

      <div className="mt-6 text-xs text-secondary-500 dark:text-secondary-400 text-center">
        Metrics updated automatically every 30 seconds
      </div>
    </div>
  );
};