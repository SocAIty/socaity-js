import { Configuration } from '../configuration';
import { EndpointMetadata, RequestOptions, SocaityJob } from '../../types';
import { ResponseParser } from './ResponseParser';
import { MediaFile } from '../../media-toolkit-js';
import { FastCloud } from '../../fastCloud/FastCloud';

/**
 * Handles HTTP requests to the Socaity API using native fetch
 */
export class RequestHandler {
  private config: Configuration;
  private uploadFileThresholdMB: number = 1;
  private maxFileUploadLimitMB: number = 1000;
  private fastCloud: FastCloud;
  private abortController: AbortController;
  private responseParser: ResponseParser;

  constructor() {
    this.config = Configuration.getInstance();
    this.abortController = new AbortController();
    this.responseParser = new ResponseParser();
    
    // Initialize FastCloud for file uploads
    this.fastCloud = new FastCloud({
      uploadEndpoint: `${this.config.baseUrl}/v0/files`,
      apiKey: this.config.apiKey ? this.config.apiKey : ''
    });
  }

  /**
   * Match request parameters against defined parameters
   * @param definingParams Expected parameters
   * @param params Actual parameters
   */
  matchParams(definingParams: Record<string, any>, params: Record<string, any>): Record<string, any> {
    const matchedParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(definingParams)) {
      if (key in params) {
        matchedParams[key] = params[key];
      } else if (value !== undefined) {
        matchedParams[key] = value;
      }
    }
    return matchedParams;
  }

  /**
   * Parse query parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   */
  parseQueryParams(endpoint: EndpointMetadata, params: Record<string, any>): Record<string, any> {
    if (!endpoint.queryParams) { return {}; }
    return this.matchParams(endpoint.queryParams, params);
  }

  /**
   * Parse body parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   */
  parseBodyParams(endpoint: EndpointMetadata, params: Record<string, any>): Record<string, any> {
    if (!endpoint.bodyParams) { return {}; }
    return this.matchParams(endpoint.bodyParams, params);
  }


  /**
   * Parse file parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @returns Processed file parameters
   */
  async parseFileParams(endpoint: EndpointMetadata, params: Record<string, any>): Promise<Record<string, any>> {
    if (!endpoint.fileParams) {
      return {};
    }
    
    // Match params against endpoint file parameters
    const matchedParams = this.matchParams(endpoint.fileParams, params);
    const result: Record<string, any> = {};
    
    try {
      // Calculate total size of all files
      let totalSizeMB = 0;
      const mediaFiles: Record<string, MediaFile> = {};
      
      // Convert all to MediaFile objects except URLs
      for (const [key, value] of Object.entries(matchedParams)) {
        if (typeof value === 'string' && value.startsWith('http')) {
          result[key] = value; // Keep URLs as they are
        } else {
          // Convert to MediaFile
          let mediaFile = value;
          try {
            mediaFile = value instanceof MediaFile ? value : await MediaFile.create(value);
          }
          catch (error) {
             console.log(`Failed to convert ${key} to MediaFile`, error);
          }

          if (!(mediaFile instanceof MediaFile)) {
            continue;
          }
          
          mediaFiles[key] = mediaFile;
          totalSizeMB += mediaFile.fileSize('mb');
        }
      }
      
      // Check total size
      if (totalSizeMB > this.maxFileUploadLimitMB) {
        throw new Error(`Total file size exceeds maximum limit of ${this.maxFileUploadLimitMB}MB`);
      }
      
      // Decide whether to upload or convert to base64
      if (totalSizeMB > this.uploadFileThresholdMB) {
        // Bulk upload if there are multiple files
        if (Object.keys(mediaFiles).length > 1) {
          const fileArray = Object.values(mediaFiles);
          const urls = await this.fastCloud.upload(fileArray) as string[];
          
          // Map the URLs back to the keys
          Object.keys(mediaFiles).forEach((key, index) => {
            result[key] = urls[index];
          });
        } else {
          // Upload files individually
          for (const [key, mediaFile] of Object.entries(mediaFiles)) {
            result[key] = await this.fastCloud.upload(mediaFile) as string;
          }
        }
      } else {
        // Convert all files to blob so that they can be sent as multipart form data
        for (const [key, mediaFile] of Object.entries(mediaFiles)) {
          result[key] = mediaFile.toBlob();
        }
      }
      
      return result;
    } catch (error) {
      throw new Error(`File parameter processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validates that an API key is available
   * @private
   */
  private validateAPIKey(apiKey?: string): string {
    const key = apiKey || this.config.apiKey;
    if (!key) {
      throw new Error('API key not provided');
    }
    return key;
  }

  /**
   * Build query string from parameters
   * @private
   */
  private buildQueryString(params: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) return '';
    
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Format error response from fetch
   * @private
   */
  private async formatErrorResponse(response: Response): Promise<Error> {
    const status = response.status;
    let errorText;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } else {
        errorText = await response.text();
      }
    } catch (e) {
      errorText = 'Could not parse error response';
    }
    
    return new Error(`API error (${status}): ${errorText}`);
  }

  /**
   * Send a request to the API
   * @param path API endpoint path
   * @param method HTTP method
   * @param queryParams URL query parameters
   * @param bodyParams Request body parameters
   * @param apiKey API key for authentication
   * @param fileParams Optional files to upload
   */
  async sendRequest(
    path: string,
    method: 'GET' | 'POST' = 'POST',
    queryParams: Record<string, any> = {},
    bodyParams: Record<string, any> = {},
    fileParams: Record<string, any> = {},
    apiKey?: string,
  ): Promise<Record<string, string> | string | null> {
    // Validate API key
    const key = this.validateAPIKey(apiKey);
    
    // Create a new AbortController for this request
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    
    // Prepare request headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${key}`
    };

    // Build URL with base and path
    let url = `${this.config.baseUrl}/${path}`;
    
    let requestBody: any = null;
    
    // For GET requests, all parameters go in the query string
    if (method === 'GET') {
      const allParams = { ...queryParams, ...bodyParams, ...fileParams };
      url += this.buildQueryString(allParams);
    } 
    // For POST requests, query parameters go in URL, others in body
    else {
      // Check if we have file parameters
      const hasFileParams = Object.keys(fileParams).length > 0;
      
      if (hasFileParams) {
        // For Socaity API: When sending files, ALL other params should go in query string
        url += this.buildQueryString({ ...queryParams, ...bodyParams });
        
        // Use FormData for requests with files - ONLY files go in the body
        const formData = new FormData();
        
        // Add file parameters to FormData
        Object.entries(fileParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            console.log(`File param ${key} type:`, Object.prototype.toString.call(value));
            formData.append(key, value);
          }
        });
        
        requestBody = formData;
        // Don't set Content-Type header, let browser set it with the boundary
      } else {
        // For regular JSON requests without files
        url += this.buildQueryString(queryParams);
        headers['Content-Type'] = 'application/json';
        requestBody = Object.keys(bodyParams).length > 0 ? JSON.stringify(bodyParams) : null;
      }
    }
  
    try {
      //console.log("QueryParams", queryParams);
      //console.log("BodyParams", requestBody);
  
      // Set request timeout (30 seconds)
      const timeoutId = setTimeout(() => {
        this.abort();
      }, 30000);

      // Make the fetch request
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal,
      });
      
      // Clear timeout as request completed
      clearTimeout(timeoutId);

      // Handle non-successful responses
      if (!response.ok) {
        throw await this.formatErrorResponse(response);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request canceled');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /**
   * Make a request to a specific endpoint
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @param apiKey API key
   */
  async request_endpoint(
    endpoint: EndpointMetadata, 
    params: Record<string, any>, 
    apiKey?: string, 
  ): Promise<SocaityJob> {
    const queryParams = this.parseQueryParams(endpoint, params);
    const bodyParams = this.parseBodyParams(endpoint, params);
    const fileParams = await this.parseFileParams(endpoint, params);

    const job = await this.sendRequest(
      endpoint.path, 
      endpoint.method, 
      queryParams, 
      bodyParams, 
      fileParams,
      apiKey
    );

    return this.responseParser.parse(job);
  }

  async refresh_status(job_id: string): Promise<SocaityJob> {
    const job = this.sendRequest('status', 'POST', { job_id: job_id });
    return this.responseParser.parse(job);
  }


  /**
   * Abort any ongoing requests
   */
  abort(): void {
    this.abortController.abort();
    this.abortController = new AbortController(); // Create a new controller for future requests
  }
}