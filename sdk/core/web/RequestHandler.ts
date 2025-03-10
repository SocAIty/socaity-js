import { Configuration } from '../../configuration';
import { ApiResponse, EndpointMetadata, RequestOptions } from '../../types';

/**
 * Handles HTTP requests to the Socaity API
 */
export class RequestHandler {
  private config: Configuration;
  private controller: AbortController;

  constructor() {
    this.config = Configuration.getInstance();
    this.controller = new AbortController();
  }

  async handleFileUpload(file?: File | Blob | string | null) {
      if (!file) return;
      return null;
  }


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
   * Filters the with endpoint.queryParams matching parameters to Record<string, any>
   * @param endpoint 
   * @param params 
   * @returns 
   */
  parseQueryParams(endpoint: EndpointMetadata, params: Record<string, any>): URLSearchParams | Record<string, any> {
    if (!endpoint.queryParams) { return {}; }
    const matchedParams = this.matchParams(endpoint.queryParams, params);
    return new URLSearchParams(matchedParams);
  }

  /**
   * Filters the with endpoint.bodyParams matching parameters to Record<string, any>
   * @param endpoint 
   * @param params 
   */
  parseBodyParams(endpoint: EndpointMetadata, params: Record<string, any>): Record<string, any> {
    if (!endpoint.bodyParams) { return {}; };
    return this.matchParams(endpoint.bodyParams, params);
  }



    /**
   * Validates that an API key is available
   * @private
   */
    private validateAPIKey(apiKey?: string) {
      if (!apiKey) {
        throw new Error('API key not provided');
      }
    }

  /**
   * Send a request to the API
   * @param path - API endpoint path
   * @param method - HTTP method (GET, POST, etc)
   * @param params - Request parameters
   * @param apiKey - API key to use for this request
   * @param file - Optional file to upload
   * @returns Promise with the API response
   */
  async sendRequest(
    path: string,
    method: 'GET' | 'POST' = 'POST',
    queryParams: Record<string, any> = {},
    bodyParams: Record<string, any> = {},
    apiKey?: string,
    file?: File | Blob | string | null
  ): Promise<ApiResponse> {

    // validate API key
    const key = apiKey || this.config.apiKey;
    this.validateAPIKey(key);

    queryParams = new URLSearchParams(queryParams);
    const url = `${this.config.baseUrl}/${path}?${queryParams.toString()}`;

    const options: RequestOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      signal: this.controller.signal
    };

    if (method === 'GET') {
      // try to put body params in the query string. GET only supports query string
      const bodyKeys = Object.keys(bodyParams);
      if (bodyKeys.length > 0) {
        for (const key of bodyKeys) {
          queryParams.append(key, bodyParams[key]);
        }
      }
    }
    else {
      // body params in body for POST requests
      options.body = JSON.stringify(bodyParams);
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

  async request_endpoint(endpoint: EndpointMetadata, params: Record<string, any>, apiKey?: string, file?: File | Blob | string | null): Promise<ApiResponse> {
    const query_params = this.parseQueryParams(endpoint, params);
    const body_params = this.parseBodyParams(endpoint, params);
    file = await this.handleFileUpload(file);
    return this.sendRequest(endpoint.path, endpoint.method, query_params, body_params, apiKey, file);
  }

  /**
   * Abort any ongoing requests
   */
  abort(): void {
    this.controller.abort();
    this.controller = new AbortController();
  }
}