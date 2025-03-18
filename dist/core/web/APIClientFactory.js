/**
 * Registry for all available APIClients
 */
export class APIClientFactory {
    static instance;
    registeredClients = new Map();
    clientConstructors = new Map();
    constructor() { }
    static getInstance() {
        if (!APIClientFactory.instance) {
            APIClientFactory.instance = new APIClientFactory();
        }
        return APIClientFactory.instance;
    }
    static registerClientType(name, constructor) {
        const factory = APIClientFactory.getInstance();
        const normalizedName = APIClientFactory.normalizeClientName(name);
        factory.clientConstructors.set(normalizedName, constructor);
    }
    static registerClient(client) {
        const factory = APIClientFactory.getInstance();
        const normalizedName = APIClientFactory.normalizeClientName(client.name);
        factory.registeredClients.set(normalizedName, client);
    }
    static getClient(name) {
        const factory = APIClientFactory.getInstance();
        const normalizedName = APIClientFactory.normalizeClientName(name);
        // Return existing instance if available
        let client = factory.registeredClients.get(normalizedName);
        if (!client) {
            // Create new instance if constructor is registered
            const constructor = factory.clientConstructors.get(normalizedName);
            if (!constructor) {
                throw new Error(`Client "${name}" not found. Available clients: ${Array.from(factory.clientConstructors.keys()).join(", ")}`);
            }
            client = new constructor();
            factory.registeredClients.set(normalizedName, client);
        }
        return client;
    }
    static getAvailableClients() {
        const factory = APIClientFactory.getInstance();
        return Array.from(factory.clientConstructors.keys());
    }
    static normalizeClientName(name) {
        return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
    }
}
//# sourceMappingURL=APIClientFactory.js.map