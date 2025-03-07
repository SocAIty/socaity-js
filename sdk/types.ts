/**
 * Represents the status of a job
 */
export enum JobStatus {
    CREATED = 'CREATED',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
  }
  
  /**
   * Represents a job in the Socaity system
   */
  export interface SocaityJob {
    id: string;
    status: JobStatus;
    progress: number;
    message?: string;
    result?: any;
    error?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Generic API response type
   */
  export interface ApiResponse {
    id?: string;
    status?: string;
    jobId?: string;
    progress?: number;
    message?: string;
    result?: any;
    error?: string;
    [key: string]: any;
  }
  
  /**
   * Configuration options for the SDK
   */
  export interface SocaityConfig {
    apiKey?: string;
    baseUrl: string;
    pollInterval: number;
    maxRetries: number;
  }
  
  /**
   * HTTP request options
   */
  export interface RequestOptions extends RequestInit {
    headers: Record<string, string>;
    body?: FormData | string;
  }

  /**
   * Text to image options
   */
  export interface Text2ImgOptions {
    apiKey?: string;
    width?: number;
    height?: number;
    steps?: number;
    seed?: number;
  }