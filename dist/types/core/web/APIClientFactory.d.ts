import { IAPIClient } from "./APIClient";
/**
 * Registry for all available APIClients
 */
export declare class APIClientFactory {
    private static instance;
    private registeredClients;
    private clientConstructors;
    private constructor();
    static getInstance(): APIClientFactory;
    static registerClientType<T extends IAPIClient>(name: string, constructor: new () => T): void;
    static registerClient(client: IAPIClient): void;
    static getClient<T extends IAPIClient>(name: string): T;
    static getAvailableClients(): string[];
    private static normalizeClientName;
}
