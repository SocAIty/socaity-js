import { Configuration } from '../configuration';
import { MediaFile } from '../../media-toolkit-js';
import { FastCloud } from '../../fastCloud/FastCloud';
/**
 * Handles HTTP requests to the Socaity API using native fetch
 */
export class RequestHandler {
    config;
    uploadFileThresholdMB = 1;
    maxFileUploadLimitMB = 1000;
    fastCloud;
    abortController;
    constructor() {
        this.config = Configuration.getInstance();
        this.abortController = new AbortController();
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
    matchParams(definingParams, params) {
        const matchedParams = {};
        for (const [key, value] of Object.entries(definingParams)) {
            if (key in params) {
                matchedParams[key] = params[key];
            }
            else if (value !== undefined) {
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
    parseQueryParams(endpoint, params) {
        if (!endpoint.queryParams) {
            return {};
        }
        return this.matchParams(endpoint.queryParams, params);
    }
    /**
     * Parse body parameters for the request
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     */
    parseBodyParams(endpoint, params) {
        if (!endpoint.bodyParams) {
            return {};
        }
        return this.matchParams(endpoint.bodyParams, params);
    }
    /**
     * Parse file parameters for the request
     * @param endpoint Endpoint metadata
     * @param params Request parameters
     * @returns Processed file parameters
     */
    async parseFileParams(endpoint, params) {
        if (!endpoint.fileParams) {
            return {};
        }
        // Match params against endpoint file parameters
        const matchedParams = this.matchParams(endpoint.fileParams, params);
        const result = {};
        try {
            // Calculate total size of all files
            let totalSizeMB = 0;
            const mediaFiles = {};
            // Convert all to MediaFile objects except URLs
            for (const [key, value] of Object.entries(matchedParams)) {
                if (typeof value === 'string' && value.startsWith('http')) {
                    result[key] = value; // Keep URLs as they are
                }
                else {
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
                    const urls = await this.fastCloud.upload(fileArray);
                    // Map the URLs back to the keys
                    Object.keys(mediaFiles).forEach((key, index) => {
                        result[key] = urls[index];
                    });
                }
                else {
                    // Upload files individually
                    for (const [key, mediaFile] of Object.entries(mediaFiles)) {
                        result[key] = await this.fastCloud.upload(mediaFile);
                    }
                }
            }
            else {
                // Convert all files to blob so that they can be sent as multipart form data
                for (const [key, mediaFile] of Object.entries(mediaFiles)) {
                    result[key] = mediaFile.toBlob();
                }
            }
            return result;
        }
        catch (error) {
            throw new Error(`File parameter processing failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Validates that an API key is available
     * @private
     */
    validateAPIKey(apiKey) {
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
    buildQueryString(params) {
        if (!params || Object.keys(params).length === 0)
            return '';
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object') {
                    searchParams.append(key, JSON.stringify(value));
                }
                else {
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
    async formatErrorResponse(response) {
        const status = response.status;
        let errorText;
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorJson = await response.json();
                errorText = JSON.stringify(errorJson);
            }
            else {
                errorText = await response.text();
            }
        }
        catch (e) {
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
    async sendRequest(path, method = 'POST', queryParams = {}, bodyParams = {}, fileParams = {}, apiKey) {
        // Validate API key
        const key = this.validateAPIKey(apiKey);
        // Create a new AbortController for this request
        this.abortController = new AbortController();
        const { signal } = this.abortController;
        // Prepare request headers
        const headers = {
            'Authorization': `Bearer ${key}`
        };
        // Build URL with base and path
        let url = `${this.config.baseUrl}/${path}`;
        let requestBody = null;
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
            }
            else {
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
        }
        catch (error) {
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
    async request_endpoint(endpoint, params, apiKey) {
        const queryParams = this.parseQueryParams(endpoint, params);
        const bodyParams = this.parseBodyParams(endpoint, params);
        const fileParams = await this.parseFileParams(endpoint, params);
        return this.sendRequest(endpoint.path, endpoint.method, queryParams, bodyParams, fileParams, apiKey);
    }
    /**
     * Abort any ongoing requests
     */
    abort() {
        this.abortController.abort();
        this.abortController = new AbortController(); // Create a new controller for future requests
    }
}
//# sourceMappingURL=RequestHandler.js.map