import { TrackedJob } from '../../../core/job/TrackedJob';

/**
 * Base interface for text-to-image models
 */
export abstract class BaseText2Image {
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated image
   */
  abstract text2img(prompt: string, options?: Record<string, any>): Promise<TrackedJob<any>>;

}