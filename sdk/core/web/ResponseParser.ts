import { JobStatus, SocaityJob, JobProgress } from '../../types';
import { FileResult, MediaFile, isFileResult } from '../../media-toolkit-js';

/**
 * Parses API responses into standardized SocaityJob format
 */
export class ResponseParser {
  /**
   * Parse response into standardized job format
   * @param response - API response object or string
   * @returns Standardized SocaityJob object
   */
  async parse(response: unknown): Promise<SocaityJob> {
    // Handle null or undefined responses
    if (response === null || response === undefined) {
      return this.createErrorJob('No response received');
    }

    // Handle string responses by attempting to parse as JSON
    if (typeof response === 'string') {
      try {
        const parsedResponse = JSON.parse(response);
        return this.parseObject(parsedResponse);
      } catch (e) {
        // If string is not valid JSON, treat it as a result
        return {
          id: '',
          status: JobStatus.COMPLETED,
          progress: { progress: 1.0, message: null },
          result: response,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    }

    return this.parseObject(response);
  }

  /**
   * Parse object responses into SocaityJob
   * @param response - Object to parse
   */
  private async parseObject(response: unknown): Promise<SocaityJob> {
    if (typeof response !== 'object' || response === null) {
      return this.createErrorJob('Invalid response format');
    }

    const typedResponse = response as Record<string, unknown>;
    
    const id = typeof typedResponse.id === 'string' ? typedResponse.id : '';
    const status = this.parseStatus(typedResponse.status as string);
    const progress = this.parseProgress(typedResponse, status);
    const result = this.parseResult(typedResponse.result);
    const error = typeof typedResponse.error === 'string' ? typedResponse.error : null;
    
    // Parse dates with fallbacks
    const createdAt = this.parseDate(typedResponse.createdAt);
    const updatedAt = this.parseDate(typedResponse.updatedAt);

    return {
      id,
      status,
      progress,
      result,
      error,
      createdAt,
      updatedAt
    };
  }

  /**
   * Creates a standard error job response
   * @param errorMessage - Error message to include
   */
  private createErrorJob(errorMessage: string): SocaityJob {
    const now = new Date();
    return {
      id: '',
      status: JobStatus.FAILED,
      progress: { progress: 0, message: errorMessage },
      result: null,
      error: errorMessage,
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Parse date from various formats
   * @param dateValue - Date value to parse
   */
  private parseDate(dateValue: unknown): Date {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    
    return new Date();
  }
  
  /**
   * Parse status from different API formats
   * @param status - Status string to parse
   */
  private parseStatus(status: unknown): JobStatus {
    if (typeof status !== 'string' || !status) {
      return JobStatus.UNKNOWN;
    }

    const normalizedStatus = status.toUpperCase();
    
    // Map various status strings to standard JobStatus values
    const statusMap: Record<string, JobStatus> = {
      'COMPLETED': JobStatus.COMPLETED,
      'SUCCEEDED': JobStatus.COMPLETED,
      'FINISHED': JobStatus.COMPLETED,
      'CREATED': JobStatus.CREATED,
      'FAILED': JobStatus.FAILED,
      'ERROR': JobStatus.FAILED,
      'IN_PROGRESS': JobStatus.PROCESSING,
      'PROCESSING': JobStatus.PROCESSING,
      'RUNNING': JobStatus.PROCESSING,
      'BOOTING': JobStatus.PROCESSING,
      'QUEUED': JobStatus.QUEUED,
      'PENDING': JobStatus.QUEUED,
      'IN_QUEUE': JobStatus.QUEUED,
      'STARTING': JobStatus.QUEUED
    };

    return statusMap[normalizedStatus] || JobStatus.UNKNOWN;
  }
  
  /**
   * Parse progress from different API formats
   * @param response - Response object containing progress information
   * @param status - Parsed job status
   */
  private parseProgress(response: Record<string, unknown>, status: JobStatus): JobProgress {
    // Extract progress data - handle both direct progress value or nested object
    let progressValue: number = 0;
    let progressMessage: string | null = null;
    
    const responseProgress = response.progress;
    
    if (typeof responseProgress === 'number') {
      progressValue = responseProgress;
    } else if (typeof responseProgress === 'string') {
      try {
        progressValue = parseFloat(responseProgress);
      } catch (error) {
        progressValue = 0;
      }
    } else if (responseProgress && typeof responseProgress === 'object') {
      const progressObj = responseProgress as Record<string, unknown>;
      
      if (typeof progressObj.progress === 'number') {
        progressValue = progressObj.progress;
      } else if (typeof progressObj.progress === 'string') {
        try {
          progressValue = parseFloat(progressObj.progress);
        } catch (error) {
          progressValue = 0;
        }
      }
      
      progressMessage = typeof progressObj.message === 'string' ? progressObj.message : null;
    }

    // Handle NaN values
    if (isNaN(progressValue)) {
      progressValue = 0;
    }
    
    // Normalize progress value between 0 and 1
    progressValue = Math.max(0, Math.min(1, progressValue));
    
    // If status is COMPLETED, set progress to 100%
    if (status === JobStatus.COMPLETED) {
      progressValue = 1.0;
    }
    
    // If message was not found in progress object, check top level
    if (!progressMessage && typeof response.message === 'string') {
      progressMessage = response.message;
    }

    return {
      progress: progressValue,
      message: progressMessage
    };
  }

  /**
   * Parse result data from different formats
   * @param result - Result data to parse
   */
  private async parseResult(result: unknown): Promise<unknown> {
    if (result === undefined || result === null) {
      return null;
    }

    // Handle arrays of results
    if (Array.isArray(result)) {
      const parsedResults = result.map(item => this.parseResult(item));
      return Promise.all(parsedResults);
    }
    
    // Handle file results
    if (isFileResult(result)) {
      try {
        return await new MediaFile().fromDict(result as FileResult);
      } catch (e) {
        // If media file parsing fails, return the original result
        return result;
      }
    }
    
    // Return other result types as is
    return result;
  }
}

