import { ApiClient } from '../../../core/web/APIClient';
import { zFluxText2ImgParams } from "./types";
import { MediaFile } from '../../../media-toolkit-js/MediaFile';
/**
 * Client for the FluxSchnell text-to-image model
 */
export class FluxSchnell extends ApiClient {
    constructor() {
        super('flux-schnell');
    }
    /**
     * Register FluxSchnell specific endpoints
     */
    registerEndpoints() {
        this.registerEndpoint({
            path: 'text2img',
            method: 'POST',
            queryParams: zFluxText2ImgParams.parse({}),
        });
    }
    async parseResult(full_output) {
        if (Array.isArray(full_output)) {
            return Promise.all(full_output.map((file) => new MediaFile().fromAny(file)));
        }
        return await new MediaFile().fromAny(full_output);
    }
    /**
     * Generate an image from a text prompt
     * @param text - Text description of the desired image
     * @param args - Additional arguments (Python *args equivalent)
     * @param kwargs - Additional options (Python **kwargs equivalent)
     * @returns TrackedJob that resolves to the generated image
     */
    text2img(text, options) {
        // Get endpoint details
        const endpoint = this.getEndpoint('text2img');
        // Create a complete params object with user options and defaults
        const params = zFluxText2ImgParams.parse({
            ...options,
            prompt: text, // Always use the text parameter as the prompt
        });
        // Submit job to API
        return this.submitTrackedJob(endpoint, params, this.parseResult);
    }
}
//# sourceMappingURL=FluxSchnell.js.map