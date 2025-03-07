// src/job-manager.ts
import { RequestHandler } from './web/RequestHandler';
import { Configuration } from '../configuration';
import { SocaityJob, JobStatus, ApiResponse } from '../types';
import { ResponseParser } from './web/ResponseParser';
import { MediaHandler } from './MediaHandler';

/**
 * Manages asynchronous jobs for the Socaity API
 */
export class JobManager {
  private requestHandler: RequestHandler;
  private config: Configuration;
  private jobs: Map<string, SocaityJob>;
  private responseParser: ResponseParser;
  private mediaHandler: MediaHandler;

  constructor(requestHandler: RequestHandler, config: Configuration) {
    this.requestHandler = requestHandler;
    this.config = config;
    this.jobs = new Map();
    this.responseParser = new ResponseParser();
    this.mediaHandler = new MediaHandler();
  }

  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(
    endpoint: string, 
    params: Record<string, any>, 
    apiKey?: string,
    file?: File | string | any  // using any instead of Buffer which is only node.js compatible.
  ): Promise<SocaityJob> {
    try {
      const response = await this.requestHandler.post(endpoint, params, apiKey, file);
      
      // Parse initial response to get job information
      if (!this.responseParser.canParse(response)) {
        throw new Error('Unexpected response format from API');
      }
      
      const job = this.responseParser.parse(response);
      
      // Store the job
      this.jobs.set(job.id, job);
      
      return job;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to submit job: ${String(error)}`);
    }
  }

  /**
   * Get all tracked jobs
   */
  getAllJobs(): SocaityJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get a specific job by ID
   * @param jobId - ID of the job to retrieve
   */
  getJob(jobId: string): SocaityJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Track a job until it completes
   * @param job - The job to track
   * @returns Promise resolving to the final result of the job
   */
  async trackJobToCompletion(job: SocaityJob): Promise<any> {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, this.config.pollInterval));
      
      const updatedJob = await this.requestHandler.get(`status/${job.id}`);
      
      if (updatedJob.status === JobStatus.COMPLETED) {
        return this.mediaHandler.processResponse(updatedJob.result);
      }
      
      if (updatedJob.status === JobStatus.FAILED) {
        throw new Error(`Job failed: ${updatedJob.error}`);
      }
    }
  }

  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if the job was cancelled
   */
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      await this.requestHandler.post(`cancel/${jobId}`, {});
      this.jobs.delete(jobId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear completed or failed jobs from tracking
   */
  clearCompletedJobs(): void {
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED) {
        this.jobs.delete(jobId);
      }
    }
  }
}
