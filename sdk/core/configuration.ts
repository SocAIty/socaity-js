import { SocaityConfig } from '../types';

/**
 * Manages global configuration settings for the SDK.
 * It is a singleton.
 */
export class Configuration implements SocaityConfig {
  private static instance: Configuration;

  apiKey?: string;
  baseUrl: string;
  pollInterval: number;
  maxRetries: number;

  private constructor(config: Partial<SocaityConfig> = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = "http://localhost:8000/v0";
    this.pollInterval = config.pollInterval || 5000;
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * Get the global configuration instance
   */
  static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(config: Partial<SocaityConfig>): void {
    const instance = Configuration.getInstance();
    if (config.apiKey !== undefined) instance.apiKey = config.apiKey;
    if (config.baseUrl !== undefined) instance.baseUrl = config.baseUrl;
    if (config.pollInterval !== undefined) instance.pollInterval = config.pollInterval;
    if (config.maxRetries !== undefined) instance.maxRetries = config.maxRetries;
  }
}
