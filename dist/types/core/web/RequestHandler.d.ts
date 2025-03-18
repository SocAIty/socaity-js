import { ApiResponse, EndpointMetadata } from '../../types';
/**
 * Handles HTTP requests to the Socaity API using native fetch
 */
export declare class RequestHandler {
    private config;
    private uploadFileThresholdMB;
    private maxFileUploadLimitMB;
    private fastCloud;
    private abortController;
    constructor();
    /**
     * Match request parameters against defined parameters
     * @param definingParams Expected parameters
     * @param params Actual parameters
     */
    matchParams(definingParams: Record<string, any>, params: Record<string, any>): Record<string, any>;
    /**
     * Parse query parameters for the request
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     */
    parseQueryParams(endpoint: EndpointMetadata, params: Record<string, any>): Record<string, any>;
    /**
     * Parse body parameters for the request
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     */
    parseBodyParams(endpoint: EndpointMetadata, params: Record<string, any>): Record<string, any>;
    /**
     * Parse file parameters for the request
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     * @returns Processed file parameters
     */
    parseFileParams(endpoint: EndpointMetadata, params: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Validates that an API key is available
     * @private
     */
    private validateAPIKey;
    /**
     * Build query string from parameters
     * @private
     */
    private buildQueryString;
    /**
     * Format error response from fetch
     * @private
     */
    private formatErrorResponse;
    /**
     * Send a request to the API
     * @param path API endpoint path
     * @param method HTTP method
     * @param queryParams URL query parameters
     * @param bodyParams Request body parameters
     * @param apiKey API key for authentication
     * @param fileParams Optional files to upload
     */
    sendRequest(path: string, method?: 'GET' | 'POST', queryParams?: Record<string, any>, bodyParams?: Record<string, any>, fileParams?: Record<string, any>, apiKey?: string): Promise<ApiResponse | string>;
    /**
     * Make a request to a specific endpoint
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     * @param apiKey API key
     */
    request_endpoint(endpoint: EndpointMetadata, params: Record<string, any>, apiKey?: string): Promise<ApiResponse | string>;
    /**
     * Abort any ongoing requests
     */
    abort(): void;
}
