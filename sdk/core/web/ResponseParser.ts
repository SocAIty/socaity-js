import { ApiResponse, JobStatus, SocaityJob } from '../../types';

/**
 * Parses API responses into standardized formats
 */
export class ResponseParser {
  /**
   * Check if the response can be parsed by this parser
   */
  canParse(response: any): boolean {
    if (!response) return false;
    
    // Check for standard Socaity API response format
    if (response.id || response.jobId) {
      return true;
    }
    
    // Check for Runpod API response format
    if (response.id && (response.status || response.state)) {
      return true;
    }
    
    // Check for Replicate API response format
    if (response.id && response.status && response.urls) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Parse response into standardized job format
   */
  parse(response: ApiResponse): SocaityJob {
    const job: SocaityJob = {
      id: response.id || response.jobId || '',
      status: this.parseStatus(response),
      progress: this.parseProgress(response),
      result: response.result || response.output || null,
      error: response.error || null,
      message: response.message || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return job;
  }
  
  /**
   * Parse status from different API formats
   */
  private parseStatus(response: ApiResponse): JobStatus {
    // Handle standard format
    const status = (response.status || '').toUpperCase();
    
    if (status === 'COMPLETED' || status === 'SUCCEEDED') {
      return JobStatus.COMPLETED;
    } else if (status === 'FAILED' || status === 'ERROR') {
      return JobStatus.FAILED;
    } else if (status === 'IN_PROGRESS' || status === 'PROCESSING' || status === 'RUNNING') {
      return JobStatus.PROCESSING;
    } else if (status === 'QUEUED' || status === 'PENDING') {
      return JobStatus.QUEUED;
    }
    
    // Handle Runpod format
    if (response.state) {
      const state = response.state.toUpperCase();
      if (state === 'COMPLETED') return JobStatus.COMPLETED;
      if (state === 'FAILED') return JobStatus.FAILED;
      if (state === 'IN_PROGRESS') return JobStatus.PROCESSING;
      if (state === 'QUEUED') return JobStatus.QUEUED;
    }
    
    return JobStatus.CREATED;
  }
  
  /**
   * Parse progress from different API formats
   */
  private parseProgress(response: ApiResponse): number {
    if (typeof response.progress === 'number') {
      return response.progress;
    }
    
    if (response.status === 'COMPLETED' || response.status === 'SUCCEEDED') {
      return 1.0;
    }
    
    return 0.0;
  }
}