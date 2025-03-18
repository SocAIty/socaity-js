import { RequestHandler } from './web/RequestHandler';
import { JobManager } from './job/JobManager';
import { Configuration } from './configuration';
import { SocaityAPI } from '../api/API';
/**
 * Main Socaity SDK class
 * Provides methods to interact with Socaity API services
 */
export class SocaitySDK extends SocaityAPI {
    requestHandler;
    jobManager;
    constructor(configOptions = {}) {
        super(configOptions);
        this.requestHandler = new RequestHandler();
        this.jobManager = JobManager.getInstance(this.requestHandler);
    }
    /**
     * Set the API key globally
     */
    setApiKey(apiKey) {
        Configuration.update({ apiKey });
    }
    /**
     * Set the base URL globally
     */
    setBaseUrl(url) {
        Configuration.update({ baseUrl: url });
    }
    /**
     * Get a list of all active jobs
     * @returns Array of all tracked jobs
     */
    getJobs() {
        return this.jobManager.getAllJobs();
    }
    /**
     * Get a specific job by ID
     * @param jobId - ID of the job to retrieve
     * @returns The job if found, undefined otherwise
     */
    getJob(jobId) {
        return this.jobManager.getJob(jobId);
    }
    /**
     * Cancel a running job
     * @param jobId - ID of the job to cancel
     * @returns Promise resolving to true if successful
     */
    async cancelJob(jobId) {
        return this.jobManager.cancelJob(jobId);
    }
}
//# sourceMappingURL=socaity.js.map