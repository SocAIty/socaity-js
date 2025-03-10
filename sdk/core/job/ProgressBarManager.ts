// Check if we're in a Node.js environment
export const isNode = typeof process !== 'undefined' && process.stdout && process.stdout.clearLine;

// Import cli-progress only in Node environment
export let cliProgress: any;
if (isNode) {
  try {
    cliProgress = require('cli-progress');
  } catch (e) {
    console.warn('cli-progress package not found. Using basic console output for progress.');
  }
}

// Singleton to manage multiple progress bars
export class ProgressBarManager {
  private static instance: ProgressBarManager;
  private multiBar: any;
  private bars: Map<string, any> = new Map();
  private isInitialized = false;

  private constructor() {
    if (isNode && cliProgress) {
      this.multiBar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: '{bar} {percentage}% | {jobId} | {phase} | {message}',
      });
      this.isInitialized = true;
    }
  }

  public static getInstance(): ProgressBarManager {
    if (!ProgressBarManager.instance) {
      ProgressBarManager.instance = new ProgressBarManager();
    }
    return ProgressBarManager.instance;
  }

  public createBar(jobId: string, phase: string): any {
    if (!this.isInitialized) return null;
    
    const bar = this.multiBar.create(100, 0, {
      jobId,
      phase,
      message: 'Starting...',
    });
    this.bars.set(jobId, bar);
    return bar;
  }

  public updateBar(jobId: string, percent: number, payload: object): void {
    const bar = this.bars.get(jobId);
    if (bar) {
      bar.update(percent, payload);
    }
  }

  public removeBar(jobId: string): void {
    const bar = this.bars.get(jobId);
    if (bar) {
      bar.stop();
      this.multiBar.remove(bar);
      this.bars.delete(jobId);
    }
  }

  public stopAll(): void {
    if (this.isInitialized) {
      this.multiBar.stop();
      this.bars.clear();
    }
  }
}
