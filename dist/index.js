import { SocaitySDK, APIClientFactory } from './core';
export { MediaFile } from './media-toolkit-js';
// Create singleton instance
const socaity = new SocaitySDK();
// Export both the instance and the class
export { socaity, SocaitySDK, APIClientFactory };
// For UMD/browser builds, export the instance directly
if (typeof window !== 'undefined') {
    // Direct assignment to global
    window.socaity = socaity;
}
// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = socaity;
    // Add class as a property if needed
    module.exports.SocaitySDK = SocaitySDK;
}
// Nicer error handling for custom errors which don't require a stack trace
process.on('uncaughtException', (error) => {
    // Check if it's our ApiKeyError with hideStack enabled
    if (error.name === 'ApiKeyError') {
        console.error(`${error.name}: ${error.message}`);
        process.exit(1);
    }
    else {
        // For other errors, let Node handle them normally
        throw error;
    }
});
//# sourceMappingURL=index.js.map