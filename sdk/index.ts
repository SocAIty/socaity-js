// src/index.ts
import { RequestHandler } from './core/web/RequestHandler';
import { JobManager } from './core/JobManager';
import { SocaityJob } from './types';
import { Configuration } from './configuration';
import { ResponseParser } from './core/web/ResponseParser';
import { MediaHandler } from './core/MediaHandler';

/**
 * Main Socaity SDK class
 * Provides methods to interact with Socaity API services
 */
class SocaitySDK {
  private requestHandler: RequestHandler;
  private jobManager: JobManager;
  private config: Configuration;

  constructor() {
    this.config = new Configuration();
    this.requestHandler = new RequestHandler(this.config);
    this.jobManager = new JobManager(this.requestHandler, this.config);
  }

  /**
   * Set the API key for all future requests
   * @param apiKey - Your Socaity API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  /**
   * Set the base URL for the API
   * @param url - Base URL for the Socaity API
   */
  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  /**
   * Generate an image from text prompt
   * @param prompt - Text description of the image to generate
   * @param options - Additional options for the request
   * @returns Promise resolving to the generated image
   */
  async text2img(prompt: string, options: { apiKey?: string } = {}): Promise<any> {    
    const endpoint = 'text2img';
    const params = { prompt };
    return this.executeRequest(endpoint, params, options);
  }

  /**
   * Chat with an AI model
   * @param messages - Array of message objects with roles and content
   * @param options - Additional options for the request
   * @returns Promise resolving to the chat response
   */
  async chat(messages: Array<{role: string, content: string}>, options: { 
    apiKey?: string,
    model?: string,
    temperature?: number
  } = {}): Promise<any> {    
    const endpoint = 'chat';
    const params = { 
      messages,
      model: options.model || 'default',
      temperature: options.temperature || 0.7
    };
    
    return this.executeRequest(endpoint, params, options);
  }

  /**
   * Upload a file to be processed by Socaity services
   * @param file - File to upload (File object, Buffer, or file path)
   * @param options - Additional options for the request
   * @returns Promise resolving to the uploaded file information
   */
  async uploadFile(file: File | string | any, options: { apiKey?: string } = {}): Promise<any> {
    this.validateApiKey(options.apiKey);
    
    const endpoint = 'upload';
    return this.executeRequest(endpoint, {}, options, file);
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

  /**
   * Execute a request to the Socaity API
   * @private
   */
  private async executeRequest(
    endpoint: string, 
    params: Record<string, any>, 
    options: { apiKey?: string } = {},
    file?: File | string | any
  ): Promise<any> {
    const apiKey = options.apiKey || this.config.apiKey;
    this.validateApiKey(apiKey);
    // Submit the job
    const job = await this.jobManager.submitJob(endpoint, params, apiKey, file);
    
    // Start tracking the job
    return this.jobManager.trackJobToCompletion(job);
  }

  /**
   * Validates that an API key is available
   * @private
   */
  private validateApiKey(providedApiKey?: string): void {
    if (!providedApiKey && !this.config.apiKey) {
      throw new Error('API key not set. Use setApiKey() method or provide an apiKey in the options.');
    }
  }
}

// Create singleton instance
const socaity = new SocaitySDK();

// Export both the instance and the class
export { socaity, SocaitySDK };

// Browser global (if running in a browser)
if (typeof window !== "undefined") {
  (window as any).socaity = socaity;
}