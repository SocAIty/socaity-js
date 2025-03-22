import { JobManager } from './job/JobManager';
import { Configuration } from './configuration';
import { SocaityJob } from '../types';
import { SocaityAPI } from '../api/API';
import { IConfig } from '../types';

/**
 * Main Socaity SDK class
 * Provides methods to interact with Socaity API services
 */
export class SocaitySDK extends SocaityAPI {
  private _jobManager?: JobManager;

  constructor(configOptions: Partial<IConfig> = {}) {
    super(configOptions);
  }

  private get jobManager(): JobManager {
    if (!this._jobManager) {
      this._jobManager = JobManager.getInstance();
    }
    return this._jobManager;
  }

  /**
   * Set the API key globally
   */
  setApiKey(apiKey: string): void {
    Configuration.update({ apiKey });
  }

  /**
   * Set the base URL globally
   */
  setBaseUrl(url: string): void {
    Configuration.update({ baseUrl: url });
  }

  /**
   * Get a list of all active jobs
   * @returns Array of all tracked jobs
   */
  getJobs(): SocaityJob[] {
    return this.jobManager.getAllJobs();
  }

  /**
   * Get a specific job by ID
   * @param jobId - ID of the job to retrieve
   * @returns The job if found, undefined otherwise
   */
  getJob(jobId: string): SocaityJob | undefined {
    return this.jobManager.getJob(jobId);
  }

  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if successful
   */
  async cancelJob(jobId: string): Promise<boolean> {
    return this.jobManager.cancelJob(jobId);
  }
}