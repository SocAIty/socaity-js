import { SocaitySDK } from './core/socaity';
export { MediaFile } from './media-toolkit-js';

// Create singleton instance
const socaity = new SocaitySDK();

// Export both the instance and the class
export { socaity, SocaitySDK };
