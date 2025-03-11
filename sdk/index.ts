import { SocaitySDK } from './core/socaity';
export { MediaFile } from './media-toolkit-js';

// Create singleton instance
const socaity = new SocaitySDK();

// Export both the instance and the class
export { socaity, SocaitySDK };

// For UMD/browser builds, export the instance directly
if (typeof window !== 'undefined') {
  // Direct assignment to global
  (window as any).socaity = socaity;
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = socaity;
  // Add class as a property if needed
  module.exports.SocaitySDK = SocaitySDK;
}