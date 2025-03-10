import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { FluxText2ImgPostParams, zFluxText2ImgParams } from "../types";
import { BaseText2Image } from './BaseText2Image';

/**
 * Client for the FluxSchnell text-to-image model
 */
export class FluxSchnell extends ApiClient implements BaseText2Image {
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
      requiresAuth: true,
      acceptsFile: false
    });
  }
  
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param args - Additional arguments (Python *args equivalent)
   * @param kwargs - Additional options (Python **kwargs equivalent)
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(text: string, options?: Partial<FluxText2ImgPostParams>): Promise<TrackedJob<any>> {
    // Get endpoint details
    const endpoint = this.getEndpoint('text2img');
    
    // Create a complete params object with user options and defaults
    const params = zFluxText2ImgParams.parse({
      ...options,
      prompt: text,  // Always use the text parameter as the prompt
    });
    
    // Submit job to API
    return this.submitTrackedJob(endpoint, params, this.config.apiKey);
  }
}
