import { RequestHandler } from './RequestHandler';
import { Configuration } from '../../configuration';
import { EndpointMetadata, SocaityJob } from '../../types';
import { JobManager } from '../job/JobManager';
import { TrackedJob } from '../job/TrackedJob';

/**
 * Base API client for all Socaity services
 */
export class ApiClient {
  protected requestHandler: RequestHandler;
  protected config: Configuration;
  protected endpoints: Map<string, EndpointMetadata>;
  protected jobManager: JobManager;
  // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
  protected name: string; 

  constructor(name: string) {
    this.name = this.sanitize_path(name);
    this.config = Configuration.getInstance();
    this.requestHandler = new RequestHandler();
    this.endpoints = new Map();
    this.jobManager = JobManager.getInstance(this.requestHandler);
    this.registerEndpoints();
  }
  
  sanitize_path(path: string): string {
    // trim trailing and leading slashes \ and /
    path = path.trim();
    path = path.replace(/\\/, '/'); // replace ALL backslashes with forward slashes
    path = path.replace(/^\/+|\/+$/g, ""); // trim leading and trailing slashes
    return path
  }

  /**
   * Register available endpoints for this API client
   * This method should be overridden by subclasses
   */
  protected registerEndpoints(): void {
    // Base implementation does nothing
  }
  
  /**
   * Register a new endpoint with the client
   */
  protected registerEndpoint(endpoint: EndpointMetadata): void {
    const sanitzized_path = this.sanitize_path(endpoint.path);
    endpoint.path = this.name + '/' + sanitzized_path;
    this.endpoints.set(sanitzized_path, endpoint);
  }
  
  /**
   * Get an endpoint by name
   */
  protected getEndpoint(name: string): EndpointMetadata {
    name = this.sanitize_path(name);
    const endpoint = this.endpoints.get(name);
    if (!endpoint) {
      throw new Error(`Unknown endpoint: ${name}`);
    }
    return endpoint;
  }
  
  /**
   * Update the client configuration
   */
  updateConfig(config: Partial<Configuration>): void {
    if (typeof config === 'object') {
      for (const [key, value] of Object.entries(config)) {
        (this.config as any)[key] = value;
      }
    }
  }

  /**
   * Submit a job to the API and return a TrackedJob for monitoring
   * @param endpoint - API endpoint path
   * @param params - Request parameters
   * @param apiKey - Optional API key to override the default
   * @param file - Optional file to upload
   * @returns A TrackedJob for monitoring the job
   */
  protected async submitTrackedJob(
    endpoint: EndpointMetadata,
    params: Record<string, any>,
    apiKey?: string,
    file?: File | Blob | string,
    verbose: boolean = true
  ): Promise<TrackedJob<any>> {
    const job = await this.jobManager.submitJob(endpoint, params, apiKey, file);
    return new TrackedJob(job, this.jobManager, endpoint, verbose);
  }

  /**
   * Get all active jobs for this client
   */
  getJobs(): SocaityJob[] {
    return this.jobManager.getAllJobs();
  }

  /**
   * Get a specific job by ID
   */
  getJob(jobId: string): SocaityJob | undefined {
    return this.jobManager.getJob(jobId);
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    return this.jobManager.cancelJob(jobId);
  }
}