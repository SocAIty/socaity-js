import { SocaityJob, JobStatus, ProcessingState, ProcessingPhase, JobEventCallback, JobProgress, EndpointMetadata } from '../../types';
import { JobManager } from './JobManager';
import { ProgressBarManager, isNode, cliProgress } from './ProgressBarManager';

type EventType = 'completed' | 'failed' | 'progressUpdated' | 'statusUpdated' | 'processingUpdated';
type EventListener = (...args: any[]) => void;
// Update callback type to allow transforming the result
export type ParseResultCallback<T> = (result: T) => T | void | Promise<T> | Promise<void>;

/**
 * Represents a tracked job that handles both internal processing and API job status
 */
export class TrackedJob<T = any> implements PromiseLike<T> {
  private apiJob: SocaityJob;
  private endpoint: EndpointMetadata
  private processingState: ProcessingState;
  private jobManager: JobManager;
  private result: T | null = null;
  private error: Error | null = null;
  private completed = false;
  private resolvePromise!: (value: T | PromiseLike<T>) => void;
  private rejectPromise!: (reason?: any) => void;
  private promise: Promise<T>;
  private eventListeners: Map<EventType, EventListener[]> = new Map();
  private verbose: boolean;
  private progressBar: any = null;
  private progressBarManager: ProgressBarManager;
  private parseResultCallbacks: ParseResultCallback<T>[] = [];
  
  constructor(apiJob: SocaityJob, jobManager: JobManager, endpoint: EndpointMetadata, onParseResult?: ParseResultCallback<T>, verbose = true) {
    this.apiJob = apiJob;
    this.jobManager = jobManager;
    this.endpoint = endpoint;
    this.verbose = verbose;
    this.processingState = {
      phase: ProcessingPhase.INITIALIZING,
      progress: 0
    };
    this.progressBarManager = ProgressBarManager.getInstance();
    
    // Create promise for then/catch handling
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    
    // Register custom parse result callback if provided
    if (onParseResult) {
      this.onParseResult(onParseResult);
    }

    // Start tracking immediately
    setTimeout(() => this.startTracking(), 0);
    
    // Initialize progress display if verbose
    if (this.verbose) {
      this.initProgressDisplay();
    }
  }
  
  /**
   * Initialize the progress display
   */
  private initProgressDisplay(): void {
    if (!this.verbose) return;
    
    if (isNode && cliProgress) {
      // Create a progress bar for this job
      this.progressBar = this.progressBarManager.createBar(
        this.apiJob.id || 'initializing',
        this.processingState.phase,
      );
      this.updateProgressDisplay();
    } else {
      // Browser or environment without cli-progress
      this.logProgress();
    }
  }
  
  /**
   * Update the progress display based on current state
   */
  private updateProgressDisplay(): void {
    if (!this.verbose) return;
    
    const phase = this.processingState.phase;
    const progressPercent = this.calculateProgressPercent();
    const message = this.formatProgressMessage();
    
    if (isNode && cliProgress && this.progressBar) {
      // Update the cli-progress bar
      this.progressBarManager.updateBar(this.apiJob.id, progressPercent, {
        phase,
        message: message.replace(/^.*\| /, ''), // Remove the progress percentage part
      });
    } else {
      // Browser or environment without cli-progress
      this.logProgress();
    }
  }
  
  /**
   * Calculate progress percentage based on current state
   */
  private calculateProgressPercent(): number {
    const phase = this.processingState.phase;
    
    // For phases with known progress
    if (phase === ProcessingPhase.TRACKING && this.apiJob.progress?.progress) {
      return Math.round(this.apiJob.progress.progress * 100);
    }
    
    // For phases with fixed progress values
    switch (phase) {
      case ProcessingPhase.INITIALIZING: return 0;
      case ProcessingPhase.PREPARING: return 5;
      case ProcessingPhase.SENDING: return 10;
      case ProcessingPhase.TRACKING: return 15;
      case ProcessingPhase.PROCESSING_RESULT: return 90;
      case ProcessingPhase.COMPLETED: return 100;
      case ProcessingPhase.FAILED: return 100;
      default: return 0;
    }
  }
  
  /**
   * Format a human-readable progress message
   */
  private formatProgressMessage(): string {
    const phase = this.processingState.phase;
    const jobId = this.apiJob.id || 'initializing';
    
    if (phase === ProcessingPhase.INITIALIZING || 
        phase === ProcessingPhase.PREPARING || 
        phase === ProcessingPhase.SENDING) {
      return `${phase} job | API: ${this.endpoint.path}`;
    } else if (phase === ProcessingPhase.TRACKING) {
      const progressPercent = this.apiJob.progress ? 
        `${Math.round(this.apiJob.progress.progress * 100)}%` : 
        'unknown';
      
      let message = `Job ${jobId} | Progress: ${progressPercent} | API: ${this.endpoint.path}`;
      if (this.apiJob.progress?.message) {
        message += ` | ${this.apiJob.progress.message}`;
      }
      return message;
    } else {
      return `Job ${jobId} | ${phase} | API: ${this.endpoint.path}`;
    }
  }
  
  /**
   * Log progress to console (for browser environments)
   */
  private logProgress(): void {
    // Only log on state changes to avoid console spam
    const message = this.formatProgressMessage();
    
    // Store last message to avoid duplicates
    if (!this._lastLoggedMessage || this._lastLoggedMessage !== message) {
      console.log(message);
      this._lastLoggedMessage = message;
    }
  }
  
  // Keep track of the last logged message to avoid duplicates
  private _lastLoggedMessage: string | null = null;
  
  /**
   * Stop the progress display
   */
  private stopProgressDisplay(): void {
    if (!this.verbose) return;
    
    if (isNode && cliProgress && this.progressBar) {
      this.progressBarManager.removeBar(this.apiJob.id);
      this.progressBar = null;
    }
    
    const phase = this.processingState.phase;
    
    // Show final message
    if (phase === ProcessingPhase.COMPLETED) {
      console.log(`✓ Job ${this.apiJob.id} completed successfully (${this.endpoint.path})`);
    } else if (phase === ProcessingPhase.FAILED) {
      console.log(`✗ Job ${this.apiJob.id} failed: ${this.processingState.message} (${this.endpoint.path})`);
    }
  }
  
  /**
   * Add an event listener
   */
  private on(eventName: EventType, callback: EventListener): this {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(callback);
    return this;
  }
  
  /**
   * Emit an event
   */
  private emit(eventName: EventType, ...args: any[]): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
  

  /**
   * Poll for job status updates
   */
  private async pollJobStatus(): Promise<void> {
    // Stop polling if job is completed or failed
    if (this.completed || !this.apiJob.id) {
      return;
    }

    try {
      // Get the latest job state
      const updatedJob = await this.jobManager.requestHandler.refresh_status(this.apiJob.id);
      if (!updatedJob) {
        // Schedule next poll
        setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
        return;
      }

      this.apiJob = updatedJob;
      
      // Update internal state based on API job status
      this.emitJobUpdate();
      
      // Update progress display
      if (this.verbose) {
        this.updateProgressDisplay();
      }
      
      if (updatedJob.status === JobStatus.COMPLETED) {
        this.updateProcessingState(ProcessingPhase.PROCESSING_RESULT, 0.9, 'Processing result');
        try {
          // Process the result
          this.result = await parsedJob.result;
          this.result = await this.runParseResultCallbacks(this.result);
          this.complete();
        } catch (error) {
          this.fail(error instanceof Error ? error : new Error(String(error)));
        }
      } else if (parsedJob.status === JobStatus.FAILED) {
        this.updateProcessingState(ProcessingPhase.FAILED, 1, parsedJob.error || 'Job failed');
        this.fail(new Error(parsedJob.error || 'Job failed with no error message'));
      } else {
        // Schedule next poll only if job is still in progress
        setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      }
    } catch (error) {
      // Don't fail the job immediately on polling errors
      console.error('Error polling job status:', error);
      
      // Keep polling even after an error
      setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
    }
  }

  /**
   * Start tracking the job
   */
  private startTracking(): void {
    this.updateProcessingState(ProcessingPhase.TRACKING, 0, 'Tracking job status');
    
    // Start the polling cycle immediately
    this.pollJobStatus();
  }
  
  /**
   * Mark the job as completed
   */
  private complete(): void {
    this.updateProcessingState(ProcessingPhase.COMPLETED, 1, 'Job completed');
    this.cleanup();
    this.completed = true;
    this.emit('completed', this.result);
    this.resolvePromise(this.result!);
  }
  
  /**
   * Mark the job as failed
   */
  private fail(error: Error): void {
    this.updateProcessingState(ProcessingPhase.FAILED, 1, error.message);
    this.cleanup();
    this.completed = true;
    this.error = error;
    this.emit('failed', error);
    this.rejectPromise(error);
  }
  
  /**
   * Clean up resources
   */
  private cleanup(): void {
    this.stopProgressDisplay();
  }
  
  /**
   * Update the internal processing state
   */
  private updateProcessingState(phase: ProcessingPhase, progress: number, message?: string): void {
    this.processingState = {
      phase,
      progress,
      message
    };
    
    // Update display if verbose
    if (this.verbose) {
      this.updateProgressDisplay();
    }
    
    this.emit('processingUpdated', this.processingState);
  }
  
  /**
   * Emit job update event
   */
  private emitJobUpdate(): void {
    this.emit('progressUpdated', this.apiJob.progress);
    this.emit('statusUpdated', this.apiJob.status);
  }
  
  /**
   * Set verbosity of progress display
   * @param verbose Whether to display progress information
   */
  setVerbose(verbose: boolean): this {
    this.verbose = verbose;
    
    if (verbose && !this.progressBar && !this.completed) {
      this.initProgressDisplay();
    } else if (!verbose && this.progressBar) {
      this.stopProgressDisplay();
    }
    
    return this;
  }
  /**
   * Register a callback for job completion
   */
  onCompleted(callback: JobEventCallback<T>): this {
    this.on('completed', callback);
    // If already completed, call the callback immediately
    if (this.completed && this.result !== null) {
      setTimeout(() => callback(this.result!), 0);
    }
    return this;
  }
  
  /**
   * Register a callback for job failure
   */
  onFailed(callback: JobEventCallback<Error|null>): this {
    this.on('failed', callback);
    // If already failed, call the callback immediately
    if (this.completed && this.error !== null) {
      setTimeout(() => callback(this.error), 0);
    }
    return this;
  }
  
  /**
   * Register a callback for job progress updates
   */
  onProgress(callback: JobEventCallback<JobProgress | null | undefined>): this {
    this.on('progressUpdated', callback);
    // Call immediately with current progress
    setTimeout(() => callback(this.apiJob.progress), 0);
    return this;
  }
  
  /**
   * Register a callback for job status updates
   */
  onStatus(callback: JobEventCallback<JobStatus>): this {
    this.on('statusUpdated', callback);
    // Call immediately with current status
    setTimeout(() => callback(this.apiJob.status), 0);
    return this;
  }
  
  /**
   * Register a callback for internal processing state updates
   */
  onProcessingUpdated(callback: JobEventCallback<ProcessingState>): this {
    this.on('processingUpdated', callback);
    // Call immediately with current processing state
    setTimeout(() => callback(this.processingState), 0);
    return this;
  }

  /**
   * Register a callback for custom post-processing of the job result
   */
  onParseResult(callback: ParseResultCallback<T>): this {
    this.parseResultCallbacks.push(callback);
    return this;
  }

  /**
   * Run all registered parse result callbacks
   */
  private async runParseResultCallbacks(result: T | any): Promise<T> {
    let currentResult = result;
    
    for (const callback of this.parseResultCallbacks) {
      const callbackResult = await callback(currentResult);
      // If callback returns a value (not undefined), use it as the new result
      if (callbackResult !== undefined) {
        currentResult = callbackResult as T;
      }
    }
    
    return currentResult;
  }
  
  /**
   * Cancel the job
   */
  async cancel(): Promise<boolean> {
    try {
      const success = await this.jobManager.cancelJob(this.apiJob.id);
      if (success) {
        this.cleanup();
        this.fail(new Error('Job cancelled by user'));
      }
      return success;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get the current job ID
   */
  get id(): string {
    return this.apiJob.id;
  }
  
  /**
   * Get the current job status
   */
  get status(): JobStatus {
    return this.apiJob.status;
  }
  
  /**
   * Get the current job progress
   */
  get progress(): JobProgress | null {
    return this.apiJob.progress || null;
  }
  
  /**
   * Get the current processing phase
   */
  get phase(): ProcessingPhase {
    return this.processingState.phase;
  }
  
  /**
   * Implementation of the PromiseLike interface
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
}