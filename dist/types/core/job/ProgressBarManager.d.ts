export declare const isNode: false | ((dir: import("tty").Direction, callback?: () => void) => boolean);
export declare let cliProgress: any;
export declare class ProgressBarManager {
    private static instance;
    private multiBar;
    private bars;
    private isInitialized;
    private constructor();
    static getInstance(): ProgressBarManager;
    createBar(jobId: string, phase: string): any;
    updateBar(jobId: string, percent: number, payload: object): void;
    removeBar(jobId: string): void;
    stopAll(): void;
}
