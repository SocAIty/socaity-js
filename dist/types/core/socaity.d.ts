import { SocaityJob } from '../types';
import { SocaityAPI } from '../api/API';
import { IConfig } from '../types';
/**
 * Main Socaity SDK class
 * Provides methods to interact with Socaity API services
 */
export declare class SocaitySDK extends SocaityAPI {
    private requestHandler;
    private jobManager;
    constructor(configOptions?: Partial<IConfig>);
    /**
     * Set the API key globally
     */
    setApiKey(apiKey: string): void;
    /**
     * Set the base URL globally
     */
    setBaseUrl(url: string): void;
    /**
     * Get a list of all active jobs
     * @returns Array of all tracked jobs
     */
    getJobs(): SocaityJob[];
    /**
     * Get a specific job by ID
     * @param jobId - ID of the job to retrieve
     * @returns The job if found, undefined otherwise
     */
    getJob(jobId: string): SocaityJob | undefined;
    /**
     * Cancel a running job
     * @param jobId - ID of the job to cancel
     * @returns Promise resolving to true if successful
     */
    cancelJob(jobId: string): Promise<boolean>;
}
