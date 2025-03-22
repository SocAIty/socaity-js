import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { FluxText2ImgPostParams, zFluxText2ImgParams } from "./types";
import { IText2Image } from './IText2Image';
import { ImageFile } from '@socaity/media-toolkit'

/**
 * Client for the FluxSchnell text-to-image model
 */
export class FluxSchnell extends ApiClient implements IText2Image {
  constructor() {
    super('flux-schnell');
  }
  /**
   * Register FluxSchnell specific endpoints
   */
  protected registerEndpoints(): void {
    this.registerEndpoint({
      path: 'text2img',
      method: 'POST',
      queryParams: zFluxText2ImgParams.parse({}),
    });
  }
  
  async parseResult(full_output: any): Promise<ImageFile | Array<ImageFile> | any> {
    if (Array.isArray(full_output)) {
      return Promise.all(full_output.map((file) => new ImageFile().fromAny(file)));
    }
    return await new ImageFile().fromAny(full_output);
  }

  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param args - Additional arguments (Python *args equivalent)
   * @param kwargs - Additional options (Python **kwargs equivalent)
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(text: string, options?: Partial<FluxText2ImgPostParams>): Promise<TrackedJob<ImageFile | Array<ImageFile> | any>> {
    // Get endpoint details
    const endpoint = this.getEndpoint('text2img');
    
    // Create a complete params object with user options and defaults
    const params = zFluxText2ImgParams.parse({
      ...options,
      prompt: text,  // Always use the text parameter as the prompt
    });
    
    // Submit job to API
    return this.submitTrackedJob(endpoint, params, this.parseResult);
  }
}
