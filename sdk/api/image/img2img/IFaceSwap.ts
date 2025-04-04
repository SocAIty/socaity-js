import { TrackedJob } from '../../../core/job/TrackedJob';
import { IAPIClient } from '../../../core/web/APIClient';
import { MediaFile } from '../../../media-toolkit-js/MediaFile';

/**
 * Base interface for text-to-image models
 */
export interface IFaceSwap extends IAPIClient {
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated image
   */
  swapImg2Img(sourceImg: MediaFile | string, targetImg: MediaFile | string,  options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>>;
}