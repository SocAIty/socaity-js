import { IConfig } from '../types';
export declare class ApiKeyError extends Error {
    constructor(message?: string);
}
/**
 * Manages global configuration settings for the SDK.
 * It is a singleton.
 */
export declare class Configuration implements IConfig {
    private static instance;
    apiKey?: string;
    baseUrl: string;
    pollInterval: number;
    maxRetries: number;
    private constructor();
    /**
     * Get the global configuration instance
     */
    static getInstance(): Configuration;
    /**
     * Updates global configuration with new values
     */
    static update(config: Partial<IConfig>): void;
}
