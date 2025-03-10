import { ApiResponse, JobStatus, SocaityJob, JobProgress } from '../../types';

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
    
    if (status === 'COMPLETED' || status === 'SUCCEEDED' || status === 'FINISHED') {
      return JobStatus.COMPLETED;
    } else if (status === 'FAILED' || status === 'ERROR') {
      return JobStatus.FAILED;
    } else if (status === 'IN_PROGRESS' || status === 'PROCESSING' || status === 'RUNNING' || 
               status === 'BOOTING') {
      return JobStatus.PROCESSING;
    } else if (status === 'QUEUED' || status === 'PENDING' || status === 'IN_QUEUE' || 
               status === 'STARTING') {
      return JobStatus.QUEUED;
    }
    
    // Handle Runpod format
    if (response.state) {
      const state = response.state.toUpperCase();
      if (state === 'COMPLETED') return JobStatus.COMPLETED;
      if (state === 'FAILED') return JobStatus.FAILED;
      if (state === 'IN_PROGRESS') return JobStatus.PROCESSING;
      if (state === 'IN_QUEUE') return JobStatus.QUEUED;
      if (state === 'CANCELLED') return JobStatus.FAILED;
      if (state === 'TIMED_OUT') return JobStatus.FAILED;
    }
    
    return JobStatus.CREATED;
  }
  
  /**
   * Parse progress from different API formats
   */
  private parseProgress(response: ApiResponse): JobProgress | null {
    // Extract progress data
    let progressValue = response.progress || 0.0;
    let progressMessage = response.message;

    // Handle nested progress info
    if (typeof progressValue === 'object' && progressValue !== null) {
      progressMessage = progressValue.message || progressMessage;
      progressValue = progressValue.progress || 0.0;
    }

    // Convert progress to float
    try {
      progressValue = typeof progressValue === 'number' ? progressValue : 
                    progressValue !== null ? parseFloat(String(progressValue)) : 0.0;
    } catch (error) {
      progressValue = 0.0;
    }

    // If status is COMPLETED, set progress to 100%
    if (this.parseStatus(response) === JobStatus.COMPLETED) {
      progressValue = 1.0;
    }

    return {
      progress: progressValue,
      message: progressMessage
    };
  }
}