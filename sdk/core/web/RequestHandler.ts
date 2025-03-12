import { Configuration } from '../configuration';
import { ApiResponse, EndpointMetadata, RequestOptions } from '../../types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

/**
 * Handles HTTP requests to the Socaity API using Axios
 */
export class RequestHandler {
  private config: Configuration;
  private axiosInstance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource;

  constructor() {
    this.config = Configuration.getInstance();
    this.cancelTokenSource = axios.CancelToken.source();
    
    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Response interceptor for common error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('Request canceled'));
        }
        
        // Format error message based on response if available
        if (error.response) {
          const status = error.response.status;
          const errorText = typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data);
          return Promise.reject(new Error(`API error (${status}): ${errorText}`));
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle file upload
   * @param file File to upload
   */
  async handleFileUpload(file?: File | Blob | string | null) {
    if (!file) return null;
    // Implementation for file handling would go here
    return null;
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
   * Send a request to the API
   * @param path API endpoint path
   * @param method HTTP method
   * @param queryParams URL query parameters
   * @param bodyParams Request body parameters
   * @param apiKey API key for authentication
   * @param file Optional file to upload
   */
  async sendRequest(
    path: string,
    method: 'GET' | 'POST' = 'POST',
    queryParams: Record<string, any> = {},
    bodyParams: Record<string, any> = {},
    fileParams: Record<string, File | Blob | string> | null = {},
    apiKey?: string,
  ): Promise<ApiResponse> {
    // Validate API key
    const key = this.validateAPIKey(apiKey);
    
    const requestConfig: AxiosRequestConfig = {
      method,
      url: path,
      headers: {
        'Authorization': `Bearer ${key}`
      },
      cancelToken: this.cancelTokenSource.token
    };

    // Handle query parameters
    if (Object.keys(queryParams).length > 0) {
      requestConfig.params = queryParams;
    }

    // Handle body parameters for POST requests
    if (method === 'POST' && Object.keys(bodyParams).length > 0) {
      requestConfig.data = bodyParams;
    }

    // If it's a GET request with body params, move them to query params
    if (method === 'GET' && Object.keys(bodyParams).length > 0) {
      requestConfig.params = {
        ...requestConfig.params,
        ...bodyParams
      };
    }

    // Handle file uploads
   // if (file) {
      // Implementation for file handling would go here
    //}

    try {
      const response: AxiosResponse = await this.axiosInstance(requestConfig);
      return response.data;
    } catch (error) {
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
   * @param file Optional file to upload
   */
  async request_endpoint(
    endpoint: EndpointMetadata, 
    params: Record<string, any>, 
    apiKey?: string, 
  ): Promise<ApiResponse> {
    const queryParams = this.parseQueryParams(endpoint, params);
    const bodyParams = this.parseBodyParams(endpoint, params);
    const fileParams = {};
    //file = await this.handleFileUpload(file);
    return this.sendRequest(
      endpoint.path, 
      endpoint.method, 
      queryParams, 
      bodyParams, 
      fileParams,
      apiKey
    );
  }

  /**
   * Abort any ongoing requests
   */
  abort(): void {
    this.cancelTokenSource.cancel('Request canceled by user');
    this.cancelTokenSource = axios.CancelToken.source(); // Create a new token source for future requests
  }
}