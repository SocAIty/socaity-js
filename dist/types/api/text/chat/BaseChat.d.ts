import { TrackedJob } from '../../../core/job/TrackedJob';
import { IAPIClient } from '../../../core/web/APIClient';
/**
 * Base interface for text-to-image models
 */
export interface IChat extends IAPIClient {
    /**
     * Generate an image from a text prompt
     * @param text - Text description of the desired image
     * @param options - Additional options for the request
     * @returns TrackedJob that resolves to the generated image
     */
    chat(prompt: string, options?: Record<string, any>): Promise<TrackedJob<any>> | Promise<string>;
}
