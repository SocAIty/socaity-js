/**
 * Represents the status of a job
 */
export enum JobStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Represents the progress of a job
 */
export interface JobProgress {
  progress: number;
  message?: string | null;
}

/**
 * Represents a job in the Socaity system
 */
export interface SocaityJob {
  id: string;
  status: JobStatus;
  progress?: JobProgress | null;
  result?: any;
  error?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Configuration options for the SDK
 */
export interface IConfig {
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
 * Chat options
 */
export interface ChatOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
}

/**
 * File upload options
 */
export interface UploadOptions {
  apiKey?: string;
  fileType?: string;
}

/**
 * Callback function type for job events
 */
export type JobEventCallback<T> = (data: T) => void;

/**
 * Endpoint metadata
 */
export interface EndpointMetadata {
  path: string;
  method: 'POST' | 'GET';
  queryParams?: Record<string, any>;
  bodyParams?: Record<string, any>;
  fileParams?: Record<string, any>;
}

/**
 * Internal job tracking status
 */
export enum ProcessingPhase {
  INITIALIZING = 'INITIALIZING',
  PREPARING = 'PREPARING',
  SENDING = 'SENDING',
  TRACKING = 'TRACKING',
  PROCESSING_RESULT = 'PROCESSING_RESULT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Represents the internal job tracking state
 */
export interface ProcessingState {
  phase: ProcessingPhase;
  progress: number;
  message?: string;
}
