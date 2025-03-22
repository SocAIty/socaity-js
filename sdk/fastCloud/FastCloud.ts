// src/FastCloud.ts
import { MediaFile } from '@socaity/media-toolkit'

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
export class FastCloud {
  private uploadEndpoint: string;
  private apiKey: string;
  private defaultTimeout: number = 60000; // 60 seconds timeout for uploads

  /**
   * Create a new FastCloud instance
   * @param config FastCloud configuration
   */
  constructor(config: FastCloudConfig) {
    this.uploadEndpoint = config.uploadEndpoint || 'https://api.socaity.ai/v0/files';
    this.apiKey = config.apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get authentication headers for requests
   * @returns Headers object with authentication
   */
  private getAuthHeaders(): Record<string, string> {
    return { 'Authorization': `Bearer ${this.apiKey}`};
  }

  /**
   * Process the upload response to extract file URLs
   * @param response Response from the upload endpoint
   * @returns Array of temporary upload URLs
   */
  private async processUploadResponse(response: Response): Promise<Array<string>> {
    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid API key');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to get temporary upload URL: ${response.status} ${response.statusText}`);
    }
    
    try {
      const urlsText = await response.text();
      const urls = JSON.parse(urlsText);
      return Array.isArray(urls) ? urls : [urls];
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error('Failed to parse response body as JSON');
    }
  }

  /**
   * Upload a file to a temporary URL
   * @param sasUrl Temporary URL for uploading
   * @param file File to upload
   */
  private async uploadToTemporaryUrl(sasUrl: string, file: MediaFile): Promise<void> {
    const headers = {
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-if-none-match': '*'
    };

    const arrayBuffer = file instanceof MediaFile ? await file.toArrayBuffer() : file;
    const response = await fetch(sasUrl, {
      method: 'PUT',
      headers,
      body: arrayBuffer,
    });

    if (response.status !== 201) {
      throw new Error(`Failed to upload to temporary URL ${sasUrl}. Response: ${response.statusText}`);
    }
  }

  /**
   * Upload a single file
   * @param file File to upload
   * @returns the URLs of the uploaded files. (If one file is uploaded, the return value is an array with one URL)
   */
  async upload(file: MediaFile | MediaFile[]): Promise<string[]> {
    const files = Array.isArray(file) ? file : [file];
    
    // Get file extensions if available
    const extensions = files.map(f => f.extension).filter(ext => ext !== null) as string[];
    
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    }

    // Request temporary upload URLs
    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
        n_files: files.length, 
        file_extensions: extensions.length > 0 ? extensions : undefined 
      }),
      signal: AbortSignal.timeout(this.defaultTimeout)
    });
    
    // Process the response to get temporary URLs
    const sasUrls = await this.processUploadResponse(response);
    
    // Upload files to temporary URLs
    const uploadPromises = sasUrls.map((url, index) => 
      this.uploadToTemporaryUrl(url, files[index])
    );
    
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    
    // Return URLs
    return sasUrls;
  }

  /**
   * Download a file from a URL
   * @param url URL to download from
   * @param savePath Optional path to save the file to
   * @returns MediaFile object or save path if specified
   */
  async download(url: string, savePath?: string): Promise<MediaFile | string> {
    const file = await new MediaFile(url).fromUrl(url, this.getAuthHeaders());
    
    if (!savePath) {
      return file;
    }
    
    await file.save(savePath);
    return savePath;
  }
}