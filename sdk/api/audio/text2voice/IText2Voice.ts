import { TrackedJob } from '../../../core/job/TrackedJob';
import { IAPIClient } from '../../../core/web/APIClient';
import { MediaFile } from '@socaity/media-toolkit'

/**
 * Base interface for text-to-voice models
 */
export interface IText2Voice extends IAPIClient {
  /**
   * Generate an realistic sounding voice from a written text.
   * @param text - Text description of the desired image
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated image
   */
  text2voice(text: string, options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>>;
}