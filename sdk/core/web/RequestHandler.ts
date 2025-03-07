import { Configuration } from '../../configuration';
import { ApiResponse, RequestOptions } from '../../types';

/**
 * Handles HTTP requests to the Socaity API
 */
export class RequestHandler {
  private config: Configuration;
  private controller: AbortController;

  constructor(config: Configuration) {
    this.config = config;
    this.controller = new AbortController();
  }

  /**
   * Send a request to the API
   * @param endpoint - API endpoint path
   * @param method - HTTP method (GET, POST, etc)
   * @param params - Request parameters
   * @param apiKey - API key to use for this request
   * @param file - Optional file to upload
   * @returns Promise with the API response
   */
  async sendRequest(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    params: Record<string, any> = {},
    apiKey?: string,
    file?: File | Blob | string
  ): Promise<ApiResponse> {
    const url = `${this.config.baseUrl}/${endpoint}`;
    const key = apiKey || this.config.apiKey;
    
    if (!key) {
      throw new Error('API key not provided');
    }

    const options: RequestOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${key}`,
      },
      signal: this.controller.signal
    };

    // Handle file uploads
    if (file) {
      const formData = new FormData();
      
      // Add parameters to form data
      Object.entries(params).forEach(([key, value]: [string, unknown]) => {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      
      // Add file to form data
      if (typeof file === 'string') {
        // Handle URL or base64 string
        formData.append('file', file);
      } else {
        // Browser File or Blob object
        formData.append('file', file);
      }
      
      options.body = formData;
    } else if (Object.keys(params).length > 0) {
      if (method === 'GET') {
        // Convert params to query string for GET requests
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]: [string, unknown]) => {
          if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, String(value));
          }
        });
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint = `${endpoint}?${queryString}`;
        }
      } else {
        // JSON body for non-file POST requests
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(params);
      }
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /**
   * Send a GET request
   */
  async get(endpoint: string, params: Record<string, any> = {}, apiKey?: string): Promise<ApiResponse> {
    return this.sendRequest(endpoint, 'GET', params, apiKey);
  }

  /**
   * Send a POST request
   */
  async post(endpoint: string, params: Record<string, any> = {}, apiKey?: string, file?: File | Blob | string): Promise<ApiResponse> {
    return this.sendRequest(endpoint, 'POST', params, apiKey, file);
  }
  
  /**
   * Abort any ongoing requests
   */
  abort(): void {
    this.controller.abort();
    this.controller = new AbortController();
  }
}