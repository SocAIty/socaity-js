import { RequestHandler } from './RequestHandler';
import { Configuration } from '../configuration';
import { EndpointMetadata, SocaityJob } from '../../types';
import { JobManager } from '../job/JobManager';
import { TrackedJob, ParseResultCallback } from '../job/TrackedJob';
/**
 * Base API client for all Socaity services
 */
export interface IAPIClient {
    readonly name: string;
    updateConfig(config: Partial<Configuration>): void;
    getJobs(): SocaityJob[];
    getJob(jobId: string): SocaityJob | undefined;
    cancelJob(jobId: string): Promise<boolean>;
}
export declare abstract class ApiClient implements IAPIClient {
    protected requestHandler: RequestHandler;
    protected config: Configuration;
    protected endpoints: Map<string, EndpointMetadata>;
    protected jobManager: JobManager;
    name: string;
    constructor(name: string);
    protected sanitizePath(path: string): string;
    /**
     * Register available endpoints for this API client
     * This method should be overridden by subclasses
     */
    protected abstract registerEndpoints(): void;
    /**
     * Register a new endpoint with the client
     */
    protected registerEndpoint(endpoint: EndpointMetadata): void;
    /**
     * Get an endpoint by name
     */
    protected getEndpoint(name: string): EndpointMetadata;
    /**
     * Update the client configuration
     */
    updateConfig(config: Partial<Configuration>): void;
    /**
     * Submit a job to the API and return a TrackedJob for monitoring
     * @param endpoint - API endpoint path
     * @param params - Request parameters
     * @param apiKey - Optional API key to override the default
     * @param file - Optional file to upload
     * @returns A TrackedJob for monitoring the job
     */
    protected submitTrackedJob<T>(endpoint: EndpointMetadata, params: Record<string, any>, onParseResult?: ParseResultCallback<T>, apiKey?: string, verbose?: boolean): Promise<TrackedJob<T>>;
    /**
     * Get all active jobs for this client
     */
    getJobs(): SocaityJob[];
    /**
     * Get a specific job by ID
     */
    getJob(jobId: string): SocaityJob | undefined;
    /**
     * Cancel a running job
     */
    cancelJob(jobId: string): Promise<boolean>;
}
