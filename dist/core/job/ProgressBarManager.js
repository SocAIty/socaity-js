// Check if we're in a Node.js environment
export const isNode = typeof process !== 'undefined' && process.stdout && process.stdout.clearLine;
// Import cli-progress only in Node environment
export let cliProgress;
if (isNode) {
    try {
        cliProgress = require('cli-progress');
    }
    catch (e) {
        console.warn('cli-progress package not found. Using basic console output for progress.');
    }
}
// Singleton to manage multiple progress bars
export class ProgressBarManager {
    static instance;
    multiBar;
    bars = new Map();
    isInitialized = false;
    constructor() {
        if (isNode && cliProgress) {
            this.multiBar = new cliProgress.MultiBar({
                clearOnComplete: false,
                hideCursor: true,
                format: '{bar} {percentage}% | {jobId} | {phase} | {message}',
            });
            this.isInitialized = true;
        }
    }
    static getInstance() {
        if (!ProgressBarManager.instance) {
            ProgressBarManager.instance = new ProgressBarManager();
        }
        return ProgressBarManager.instance;
    }
    createBar(jobId, phase) {
        if (!this.isInitialized)
            return null;
        const bar = this.multiBar.create(100, 0, {
            jobId,
            phase,
            message: 'Starting...',
        });
        this.bars.set(jobId, bar);
        return bar;
    }
    updateBar(jobId, percent, payload) {
        const bar = this.bars.get(jobId);
        if (bar) {
            bar.update(percent, payload);
        }
    }
    removeBar(jobId) {
        const bar = this.bars.get(jobId);
        if (bar) {
            bar.stop();
            this.multiBar.remove(bar);
            this.bars.delete(jobId);
        }
    }
    stopAll() {
        if (this.isInitialized) {
            this.multiBar.stop();
            this.bars.clear();
        }
    }
}
//# sourceMappingURL=ProgressBarManager.js.map