import { AdviseRequest, AdviseResponse, Course, HealthResponse, MetricsResponse } from '../types';

const BASE_URL = 'http://localhost:8000';

export class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.fetchWithErrorHandling<HealthResponse>(`${BASE_URL}/health`);
  }

  async getCourse(courseId: string): Promise<Course> {
    return this.fetchWithErrorHandling<Course>(`${BASE_URL}/course/${courseId}`);
  }

  async getMetrics(): Promise<MetricsResponse> {
    return this.fetchWithErrorHandling<MetricsResponse>(`${BASE_URL}/metrics`);
  }

  async getAdvice(request: AdviseRequest): Promise<AdviseResponse> {
    return this.fetchWithErrorHandling<AdviseResponse>(`${BASE_URL}/advise`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async downloadPdf(request: AdviseRequest): Promise<Blob> {
    try {
      const response = await fetch(`${BASE_URL}/plan/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('PDF download failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();