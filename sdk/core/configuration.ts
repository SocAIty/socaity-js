import { IConfig } from '../types';


export class ApiKeyError extends Error {
  constructor(message: string = "Invalid API key format. API keys should start with 'sk_' and be 67 characters long.") {
    super(message);
    this.name = "ApiKeyError";
    
    // This ensures proper stack traces in modern JS engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiKeyError);
    }
  }
}

/**
 * Manages global configuration settings for the SDK.
 * It is a singleton.
 */
export class Configuration implements IConfig {
  private static instance: Configuration;

  apiKey?: string;
  baseUrl: string;
  pollInterval: number;
  maxRetries: number;

  private constructor(config: Partial<IConfig> = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = "https://api.socaity.ai/v0"
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
  static update(config: Partial<IConfig>): void {
    if (config.apiKey !== undefined) {
      if (!config.apiKey.startsWith("sk_") || !(config.apiKey.length == 67)) {
        throw new ApiKeyError("API key is wrong. Get your API key from the Socaity https://www.socaity.ai dashboard.");
      }
    }
    const instance = Configuration.getInstance();
    Object.assign(instance, config);
  }
}
