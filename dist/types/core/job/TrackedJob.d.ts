import { SocaityJob, JobStatus, ProcessingState, ProcessingPhase, JobEventCallback, JobProgress, EndpointMetadata } from '../../types';
import { JobManager } from './JobManager';
export type ParseResultCallback<T> = (result: T) => T | void | Promise<T> | Promise<void>;
/**
 * Represents a tracked job that handles both internal processing and API job status
 */
export declare class TrackedJob<T = any> implements PromiseLike<T> {
    private apiJob;
    private endpoint;
    private processingState;
    private jobManager;
    private result;
    private error;
    private completed;
    private resolvePromise;
    private rejectPromise;
    private promise;
    private eventListeners;
    private verbose;
    private progressBar;
    private progressBarManager;
    private parseResultCallbacks;
    constructor(apiJob: SocaityJob, jobManager: JobManager, endpoint: EndpointMetadata, onParseResult?: ParseResultCallback<T>, verbose?: boolean);
    /**
     * Initialize the progress display
     */
    private initProgressDisplay;
    /**
     * Update the progress display based on current state
     */
    private updateProgressDisplay;
    /**
     * Calculate progress percentage based on current state
     */
    private calculateProgressPercent;
    /**
     * Format a human-readable progress message
     */
    private formatProgressMessage;
    /**
     * Log progress to console (for browser environments)
     */
    private logProgress;
    private _lastLoggedMessage;
    /**
     * Stop the progress display
     */
    private stopProgressDisplay;
    /**
     * Add an event listener
     */
    private on;
    /**
     * Emit an event
     */
    private emit;
    /**
     * Poll for job status updates
     */
    private pollJobStatus;
    /**
     * Start tracking the job
     */
    private startTracking;
    /**
     * Mark the job as completed
     */
    private complete;
    /**
     * Mark the job as failed
     */
    private fail;
    /**
     * Clean up resources
     */
    private cleanup;
    /**
     * Update the internal processing state
     */
    private updateProcessingState;
    /**
     * Emit job update event
     */
    private emitJobUpdate;
    /**
     * Set verbosity of progress display
     * @param verbose Whether to display progress information
     */
    setVerbose(verbose: boolean): this;
    /**
     * Register a callback for job completion
     */
    onCompleted(callback: JobEventCallback<T>): this;
    /**
     * Register a callback for job failure
     */
    onFailed(callback: JobEventCallback<Error | null>): this;
    /**
     * Register a callback for job progress updates
     */
    onProgress(callback: JobEventCallback<JobProgress | null | undefined>): this;
    /**
     * Register a callback for job status updates
     */
    onStatus(callback: JobEventCallback<JobStatus>): this;
    /**
     * Register a callback for internal processing state updates
     */
    onProcessingUpdated(callback: JobEventCallback<ProcessingState>): this;
    /**
     * Register a callback for custom post-processing of the job result
     */
    onParseResult(callback: ParseResultCallback<T>): this;
    /**
     * Run all registered parse result callbacks
     */
    private runParseResultCallbacks;
    /**
     * Cancel the job
     */
    cancel(): Promise<boolean>;
    /**
     * Get the current job ID
     */
    get id(): string;
    /**
     * Get the current job status
     */
    get status(): JobStatus;
    /**
     * Get the current job progress
     */
    get progress(): JobProgress | null;
    /**
     * Get the current processing phase
     */
    get phase(): ProcessingPhase;
    /**
     * Implementation of the PromiseLike interface
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
}
