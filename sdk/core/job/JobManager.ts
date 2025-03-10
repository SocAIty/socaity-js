import { RequestHandler } from '../web/RequestHandler';
import { Configuration } from '../../configuration';
import { SocaityJob, JobStatus, EndpointMetadata } from '../../types';
import { ResponseParser } from '../web/ResponseParser';
import { MediaHandler } from '../MediaHandler';

/**
 * Manages asynchronous jobs for the Socaity API
 */
export class JobManager {
  requestHandler: RequestHandler;
  config: Configuration;
  private jobs: Map<string, SocaityJob>;
  responseParser: ResponseParser;
  mediaHandler: MediaHandler;
  private static instance: JobManager;

  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  public static getInstance(requestHandler?: RequestHandler): JobManager {
    if (!JobManager.instance) {
      if (!requestHandler) {
        // This assumes RequestHandler has a default constructor
        requestHandler = new RequestHandler();
      }
      JobManager.instance = new JobManager(requestHandler);
    }
    return JobManager.instance;
  }

  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  private constructor(requestHandler: RequestHandler) {
    this.requestHandler = requestHandler;
    this.config = Configuration.getInstance();
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
    endpoint: EndpointMetadata, 
    params: Record<string, any>, 
    apiKey?: string,
    file?: File | string | Blob
  ): Promise<SocaityJob> {
    try {
      const response = await this.requestHandler.request_endpoint(endpoint, params, apiKey, file);
      
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
    let retries = 0;
    
    while (retries < this.config.maxRetries) {
      try {
        const updatedJob = await this.requestHandler.sendRequest('status', 'POST', { job_id: job.id });
        const parsedJob = this.responseParser.parse(updatedJob);
        
        // Update our stored job
        this.jobs.set(job.id, parsedJob);

        if (parsedJob.status === JobStatus.COMPLETED) {
          return parsedJob.result;
          //return this.mediaHandler.processResponse(parsedJob.result);
        }
        
        if (parsedJob.status === JobStatus.FAILED) {
          throw new Error(`Job failed: ${parsedJob.error}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, this.config.pollInterval));
      } catch (error) {
        retries++;
        if (retries >= this.config.maxRetries) {
          throw error;
        }
        // Exponential backoff for retries
        await new Promise(resolve => setTimeout(resolve, this.config.pollInterval * retries));
      }
    }
    
    throw new Error('Max retries exceeded while tracking job');
  }

  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if the job was cancelled
   */
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      await this.requestHandler.sendRequest('cancel', "GET", { job_id: jobId });
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