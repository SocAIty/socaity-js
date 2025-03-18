import { JobStatus, ProcessingPhase } from '../../types';
import { ProgressBarManager, isNode, cliProgress } from './ProgressBarManager';
/**
 * Represents a tracked job that handles both internal processing and API job status
 */
export class TrackedJob {
    apiJob;
    endpoint;
    processingState;
    jobManager;
    result = null;
    error = null;
    completed = false;
    resolvePromise;
    rejectPromise;
    promise;
    eventListeners = new Map();
    verbose;
    progressBar = null;
    progressBarManager;
    parseResultCallbacks = [];
    constructor(apiJob, jobManager, endpoint, onParseResult, verbose = true) {
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
        this.promise = new Promise((resolve, reject) => {
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
    initProgressDisplay() {
        if (!this.verbose)
            return;
        if (isNode && cliProgress) {
            // Create a progress bar for this job
            this.progressBar = this.progressBarManager.createBar(this.apiJob.id || 'initializing', this.processingState.phase);
            this.updateProgressDisplay();
        }
        else {
            // Browser or environment without cli-progress
            this.logProgress();
        }
    }
    /**
     * Update the progress display based on current state
     */
    updateProgressDisplay() {
        if (!this.verbose)
            return;
        const phase = this.processingState.phase;
        const progressPercent = this.calculateProgressPercent();
        const message = this.formatProgressMessage();
        if (isNode && cliProgress && this.progressBar) {
            // Update the cli-progress bar
            this.progressBarManager.updateBar(this.apiJob.id, progressPercent, {
                phase,
                message: message.replace(/^.*\| /, ''), // Remove the progress percentage part
            });
        }
        else {
            // Browser or environment without cli-progress
            this.logProgress();
        }
    }
    /**
     * Calculate progress percentage based on current state
     */
    calculateProgressPercent() {
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
    formatProgressMessage() {
        const phase = this.processingState.phase;
        const jobId = this.apiJob.id || 'initializing';
        if (phase === ProcessingPhase.INITIALIZING ||
            phase === ProcessingPhase.PREPARING ||
            phase === ProcessingPhase.SENDING) {
            return `${phase} job | API: ${this.endpoint.path}`;
        }
        else if (phase === ProcessingPhase.TRACKING) {
            const progressPercent = this.apiJob.progress ?
                `${Math.round(this.apiJob.progress.progress * 100)}%` :
                'unknown';
            let message = `Job ${jobId} | Progress: ${progressPercent} | API: ${this.endpoint.path}`;
            if (this.apiJob.progress?.message) {
                message += ` | ${this.apiJob.progress.message}`;
            }
            return message;
        }
        else {
            return `Job ${jobId} | ${phase} | API: ${this.endpoint.path}`;
        }
    }
    /**
     * Log progress to console (for browser environments)
     */
    logProgress() {
        // Only log on state changes to avoid console spam
        const message = this.formatProgressMessage();
        // Store last message to avoid duplicates
        if (!this._lastLoggedMessage || this._lastLoggedMessage !== message) {
            console.log(message);
            this._lastLoggedMessage = message;
        }
    }
    // Keep track of the last logged message to avoid duplicates
    _lastLoggedMessage = null;
    /**
     * Stop the progress display
     */
    stopProgressDisplay() {
        if (!this.verbose)
            return;
        if (isNode && cliProgress && this.progressBar) {
            this.progressBarManager.removeBar(this.apiJob.id);
            this.progressBar = null;
        }
        const phase = this.processingState.phase;
        // Show final message
        if (phase === ProcessingPhase.COMPLETED) {
            console.log(`✓ Job ${this.apiJob.id} completed successfully (${this.endpoint.path})`);
        }
        else if (phase === ProcessingPhase.FAILED) {
            console.log(`✗ Job ${this.apiJob.id} failed: ${this.processingState.message} (${this.endpoint.path})`);
        }
    }
    /**
     * Add an event listener
     */
    on(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        this.eventListeners.get(eventName).push(callback);
        return this;
    }
    /**
     * Emit an event
     */
    emit(eventName, ...args) {
        const listeners = this.eventListeners.get(eventName);
        if (listeners) {
            listeners.forEach(listener => listener(...args));
        }
    }
    /**
     * Poll for job status updates
     */
    async pollJobStatus() {
        // Stop polling if job is completed or failed
        if (this.completed || !this.apiJob.id) {
            return;
        }
        try {
            // Get the latest job state
            const updatedJob = await this.jobManager.requestHandler.sendRequest('status', 'POST', { job_id: this.apiJob.id });
            if (!updatedJob) {
                // Schedule next poll
                setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
                return;
            }
            // Update our copy of the job
            const parsedJob = await this.jobManager.responseParser.parse(updatedJob);
            this.apiJob = parsedJob;
            // Update internal state based on API job status
            this.emitJobUpdate();
            // Update progress display
            if (this.verbose) {
                this.updateProgressDisplay();
            }
            if (parsedJob.status === JobStatus.COMPLETED) {
                this.updateProcessingState(ProcessingPhase.PROCESSING_RESULT, 0.9, 'Processing result');
                try {
                    // Process the result
                    this.result = await parsedJob.result;
                    this.result = await this.runParseResultCallbacks(this.result);
                    this.complete();
                }
                catch (error) {
                    this.fail(error instanceof Error ? error : new Error(String(error)));
                }
            }
            else if (parsedJob.status === JobStatus.FAILED) {
                this.updateProcessingState(ProcessingPhase.FAILED, 1, parsedJob.error || 'Job failed');
                this.fail(new Error(parsedJob.error || 'Job failed with no error message'));
            }
            else {
                // Schedule next poll only if job is still in progress
                setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
            }
        }
        catch (error) {
            // Don't fail the job immediately on polling errors
            console.error('Error polling job status:', error);
            // Keep polling even after an error
            setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
        }
    }
    /**
     * Start tracking the job
     */
    startTracking() {
        this.updateProcessingState(ProcessingPhase.TRACKING, 0, 'Tracking job status');
        // Start the polling cycle immediately
        this.pollJobStatus();
    }
    /**
     * Mark the job as completed
     */
    complete() {
        this.updateProcessingState(ProcessingPhase.COMPLETED, 1, 'Job completed');
        this.cleanup();
        this.completed = true;
        this.emit('completed', this.result);
        this.resolvePromise(this.result);
    }
    /**
     * Mark the job as failed
     */
    fail(error) {
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
    cleanup() {
        this.stopProgressDisplay();
    }
    /**
     * Update the internal processing state
     */
    updateProcessingState(phase, progress, message) {
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
    emitJobUpdate() {
        this.emit('progressUpdated', this.apiJob.progress);
        this.emit('statusUpdated', this.apiJob.status);
    }
    /**
     * Set verbosity of progress display
     * @param verbose Whether to display progress information
     */
    setVerbose(verbose) {
        this.verbose = verbose;
        if (verbose && !this.progressBar && !this.completed) {
            this.initProgressDisplay();
        }
        else if (!verbose && this.progressBar) {
            this.stopProgressDisplay();
        }
        return this;
    }
    /**
     * Register a callback for job completion
     */
    onCompleted(callback) {
        this.on('completed', callback);
        // If already completed, call the callback immediately
        if (this.completed && this.result !== null) {
            setTimeout(() => callback(this.result), 0);
        }
        return this;
    }
    /**
     * Register a callback for job failure
     */
    onFailed(callback) {
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
    onProgress(callback) {
        this.on('progressUpdated', callback);
        // Call immediately with current progress
        setTimeout(() => callback(this.apiJob.progress), 0);
        return this;
    }
    /**
     * Register a callback for job status updates
     */
    onStatus(callback) {
        this.on('statusUpdated', callback);
        // Call immediately with current status
        setTimeout(() => callback(this.apiJob.status), 0);
        return this;
    }
    /**
     * Register a callback for internal processing state updates
     */
    onProcessingUpdated(callback) {
        this.on('processingUpdated', callback);
        // Call immediately with current processing state
        setTimeout(() => callback(this.processingState), 0);
        return this;
    }
    /**
     * Register a callback for custom post-processing of the job result
     */
    onParseResult(callback) {
        this.parseResultCallbacks.push(callback);
        return this;
    }
    /**
     * Run all registered parse result callbacks
     */
    async runParseResultCallbacks(result) {
        let currentResult = result;
        for (const callback of this.parseResultCallbacks) {
            const callbackResult = await callback(currentResult);
            // If callback returns a value (not undefined), use it as the new result
            if (callbackResult !== undefined) {
                currentResult = callbackResult;
            }
        }
        return currentResult;
    }
    /**
     * Cancel the job
     */
    async cancel() {
        try {
            const success = await this.jobManager.cancelJob(this.apiJob.id);
            if (success) {
                this.cleanup();
                this.fail(new Error('Job cancelled by user'));
            }
            return success;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get the current job ID
     */
    get id() {
        return this.apiJob.id;
    }
    /**
     * Get the current job status
     */
    get status() {
        return this.apiJob.status;
    }
    /**
     * Get the current job progress
     */
    get progress() {
        return this.apiJob.progress || null;
    }
    /**
     * Get the current processing phase
     */
    get phase() {
        return this.processingState.phase;
    }
    /**
     * Implementation of the PromiseLike interface
     */
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
}
//# sourceMappingURL=TrackedJob.js.map