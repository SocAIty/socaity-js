import { RequestHandler } from './RequestHandler';
import { Configuration } from '../configuration';
import { JobManager } from '../job/JobManager';
import { TrackedJob } from '../job/TrackedJob';
import { APIClientFactory } from './APIClientFactory';
export class ApiClient {
    requestHandler;
    config;
    endpoints;
    jobManager;
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    name;
    constructor(name) {
        this.name = this.sanitizePath(name);
        this.config = Configuration.getInstance();
        this.requestHandler = new RequestHandler();
        this.endpoints = new Map();
        this.jobManager = JobManager.getInstance(this.requestHandler);
        this.registerEndpoints();
        APIClientFactory.registerClient(this);
    }
    sanitizePath(path) {
        if (!path || typeof path !== 'string') {
            return '';
        }
        return path.toLowerCase()
            .trim().replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\//g, '-') // Replace backslashes with forward slashes
            .replace(/[\s_]/g, '-') // Replace spaces and underscores with hyphens
            .replace(/[^a-z0-9\-]/g, '') // Keep only alphanumeric and hyphens
            .replace(/\-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^\-+|\-+$/g, '') // Remove leading/trailing hyphens
            .trim();
    }
    /**
     * Register a new endpoint with the client
     */
    registerEndpoint(endpoint) {
        const sanitzized_path = this.sanitizePath(endpoint.path);
        endpoint.path = this.name + '/' + sanitzized_path;
        this.endpoints.set(sanitzized_path, endpoint);
    }
    /**
     * Get an endpoint by name
     */
    getEndpoint(name) {
        name = this.sanitizePath(name);
        const endpoint = this.endpoints.get(name);
        if (!endpoint) {
            throw new Error(`Unknown endpoint: ${name}`);
        }
        return endpoint;
    }
    /**
     * Update the client configuration
     */
    updateConfig(config) {
        Configuration.update(config);
    }
    /**
     * Submit a job to the API and return a TrackedJob for monitoring
     * @param endpoint - API endpoint path
     * @param params - Request parameters
     * @param apiKey - Optional API key to override the default
     * @param file - Optional file to upload
     * @returns A TrackedJob for monitoring the job
     */
    async submitTrackedJob(endpoint, params, onParseResult, apiKey, verbose = true) {
        const job = await this.jobManager.submitJob(endpoint, params, apiKey);
        return new TrackedJob(job, this.jobManager, endpoint, onParseResult, verbose);
    }
    /**
     * Get all active jobs for this client
     */
    getJobs() {
        return this.jobManager.getAllJobs();
    }
    /**
     * Get a specific job by ID
     */
    getJob(jobId) {
        return this.jobManager.getJob(jobId);
    }
    /**
     * Cancel a running job
     */
    async cancelJob(jobId) {
        return this.jobManager.cancelJob(jobId);
    }
}
//# sourceMappingURL=APIClient.js.map