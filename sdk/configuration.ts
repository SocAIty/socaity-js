import { SocaityConfig } from './types';

/**
 * Manages configuration settings for the SDK
 */
export class Configuration implements SocaityConfig {
  apiKey?: string;
  baseUrl: string;
  pollInterval: number;
  maxRetries: number;

  constructor(config: Partial<SocaityConfig> = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.socaity.ai/v1';
    this.pollInterval = config.pollInterval || 1000;
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * Updates configuration with new values
   */
  update(config: Partial<SocaityConfig>): void {
    if (config.apiKey !== undefined) this.apiKey = config.apiKey;
    if (config.baseUrl !== undefined) this.baseUrl = config.baseUrl;
    if (config.pollInterval !== undefined) this.pollInterval = config.pollInterval;
    if (config.maxRetries !== undefined) this.maxRetries = config.maxRetries;
  }

  /**
   * Creates a copy of this configuration
   */
  clone(): Configuration {
    return new Configuration({
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      pollInterval: this.pollInterval,
      maxRetries: this.maxRetries
    });
  }
}