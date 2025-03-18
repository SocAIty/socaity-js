import { RequestHandler } from '../web/RequestHandler';
import { Configuration } from '../configuration';
import { SocaityJob, EndpointMetadata } from '../../types';
import { ResponseParser } from '../web/ResponseParser';
import { MediaFile } from '../../media-toolkit-js';
/**
 * Manages asynchronous jobs for the Socaity API
 */
export declare class JobManager {
    requestHandler: RequestHandler;
    config: Configuration;
    private jobs;
    responseParser: ResponseParser;
    mediaHandler: MediaFile;
    private static instance;
    /**
     * Get the singleton instance of JobManager
     * @param requestHandler - Optional RequestHandler to use when creating the instance
     * @returns The JobManager instance
     */
    static getInstance(requestHandler?: RequestHandler): JobManager;
    /**
     * Private constructor to enforce singleton pattern
     * @param requestHandler - RequestHandler for API communication
     */
    private constructor();
    /**
     * Submit a new job to the API
     * @param endpoint - API endpoint to call
     * @param params - Parameters for the job
     * @param apiKey - Optional API key to use for this request
     * @param file - Optional file to include
     * @returns Promise resolving to the created job
     */
    submitJob<T>(endpoint: EndpointMetadata, params: Record<string, any>, apiKey?: string): Promise<SocaityJob>;
    /**
     * Get all tracked jobs
     */
    getAllJobs(): SocaityJob[];
    /**
     * Get a specific job by ID
     * @param jobId - ID of the job to retrieve
     */
    getJob(jobId: string): SocaityJob | undefined;
    /**
     * Track a job until it completes
     * @param job - The job to track
     * @returns Promise resolving to the final result of the job
     */
    trackJobToCompletion(job: SocaityJob): Promise<any>;
    /**
     * Cancel a running job
     * @param jobId - ID of the job to cancel
     * @returns Promise resolving to true if the job was cancelled
     */
    cancelJob(jobId: string): Promise<boolean>;
    /**
     * Clear completed or failed jobs from tracking
     */
    clearCompletedJobs(): void;
}
