import { MediaFile } from '../media-toolkit-js';
/**
 * Configuration interface for FastCloud
 */
export interface FastCloudConfig {
    uploadEndpoint: string;
    apiKey: string;
}
/**
 * FastCloud class for handling file uploads
 * TypeScript equivalent of BaseUploadAPI and SocaityUploadAPI
 */
export declare class FastCloud {
    private uploadEndpoint;
    private apiKey;
    private defaultTimeout;
    /**
     * Create a new FastCloud instance
     * @param config FastCloud configuration
     */
    constructor(config: FastCloudConfig);
    /**
     * Get authentication headers for requests
     * @returns Headers object with authentication
     */
    private getAuthHeaders;
    /**
     * Process the upload response to extract file URLs
     * @param response Response from the upload endpoint
     * @returns Array of temporary upload URLs
     */
    private processUploadResponse;
    /**
     * Upload a file to a temporary URL
     * @param sasUrl Temporary URL for uploading
     * @param file File to upload
     */
    private uploadToTemporaryUrl;
    /**
     * Upload a single file
     * @param file File to upload
     * @returns URL of the uploaded file
     */
    upload(file: MediaFile | MediaFile[]): Promise<string | string[]>;
    /**
     * Download a file from a URL
     * @param url URL to download from
     * @param savePath Optional path to save the file to
     * @returns MediaFile object or save path if specified
     */
    download(url: string, savePath?: string): Promise<MediaFile | string>;
}
