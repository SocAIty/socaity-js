import { RequestHandler } from './RequestHandler';
import { Configuration } from '../configuration';
import { EndpointMetadata, SocaityJob } from '../../types';
import { JobManager } from '../job/JobManager';
import { TrackedJob, ParseResultCallback } from '../job/TrackedJob';
import { APIClientFactory } from './APIClientFactory';

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



export abstract class ApiClient implements IAPIClient {
  protected requestHandler: RequestHandler;
  protected config: Configuration;
  protected endpoints: Map<string, EndpointMetadata>;
  protected jobManager: JobManager;
  // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
  public name: string; 

  constructor(name: string) {
    this.name = name;
    this.config = Configuration.getInstance();
    this.requestHandler = new RequestHandler();
    this.endpoints = new Map();
    this.jobManager = JobManager.getInstance(this.requestHandler);
    this.registerEndpoints();
    APIClientFactory.registerClient(this);
  }
  
  protected sanitizePath(path: string): string {
    return path.trim()
      .replace(/\\/g, '/') // Replace ALL backslashes with forward slashes
      .replace(/^\/+|\/+$/g, ""); // Trim leading and trailing slashes
  }

  /**
   * Register available endpoints for this API client
   * This method should be overridden by subclasses
   */
  protected abstract registerEndpoints(): void;

  /**
   * Register a new endpoint with the client
   */
  protected registerEndpoint(endpoint: EndpointMetadata): void {
    const sanitzized_path = this.sanitizePath(endpoint.path);
    endpoint.path = this.name + '/' + sanitzized_path;
    this.endpoints.set(sanitzized_path, endpoint);
  }
  
  /**
   * Get an endpoint by name
   */
  protected getEndpoint(name: string): EndpointMetadata {
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
  updateConfig(config: Partial<Configuration>): void {
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
  protected async submitTrackedJob<T>(
    endpoint: EndpointMetadata,
    params: Record<string, any>,
    onParseResult?: ParseResultCallback<T> ,
    apiKey?: string,
    verbose: boolean = true

  ): Promise<TrackedJob<T>> {
    const job = await this.jobManager.submitJob(endpoint, params, apiKey);
    return new TrackedJob(job, this.jobManager, endpoint, onParseResult, verbose);
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