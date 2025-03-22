import { TrackedJob } from '../../../core/job/TrackedJob';
import { IAPIClient } from '../../../core/web/APIClient';
import { ImageFile } from '@socaity/media-toolkit'
/**
 * Base interface for text-to-image models
 */
export interface IText2Image extends IAPIClient {
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(prompt: string, options?: Record<string, any>): Promise<TrackedJob<ImageFile | any>>;
}