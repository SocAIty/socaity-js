import { IAPIClient } from "./APIClient";

/**
 * Registry for all available APIClients
 */
export class APIClientFactory {
    private static instance: APIClientFactory;
    private registeredClients: Map<string, IAPIClient> = new Map();
    private clientConstructors: Map<string, new () => IAPIClient> = new Map();
    
    private constructor() {}
    
    static getInstance(): APIClientFactory {
      if (!APIClientFactory.instance) {
        APIClientFactory.instance = new APIClientFactory();
      }
      return APIClientFactory.instance;
    }
  
    static registerClientType<T extends IAPIClient>(
      name: string, 
      constructor: new () => T
    ): void {
      const factory = APIClientFactory.getInstance();
      const normalizedName = APIClientFactory.normalizeClientName(name);
      factory.clientConstructors.set(normalizedName, constructor as new () => IAPIClient);
    }
    
    static registerClient(client: IAPIClient): void {
      const factory = APIClientFactory.getInstance();
      const normalizedName = APIClientFactory.normalizeClientName(client.name);
      factory.registeredClients.set(normalizedName, client);
    }
    
    static getClient<T extends IAPIClient>(name: string): T {
      const factory = APIClientFactory.getInstance();
      const normalizedName = APIClientFactory.normalizeClientName(name);
      
      // Return existing instance if available
      let client = factory.registeredClients.get(normalizedName);
      
      if (!client) {
        // Create new instance if constructor is registered
        const constructor = factory.clientConstructors.get(normalizedName);
        if (!constructor) {
          throw new Error(
            `Client "${name}" not found. Available clients: ${Array.from(factory.clientConstructors.keys()).join(", ")}`
          );
        }
        
        client = new constructor();
        factory.registeredClients.set(normalizedName, client);
      }
      
      return client as T;
    }
    
    static getAvailableClients(): string[] {
      const factory = APIClientFactory.getInstance();
      return Array.from(factory.clientConstructors.keys());
    }
    
    private static normalizeClientName(name: string): string {
      return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
    }
  }