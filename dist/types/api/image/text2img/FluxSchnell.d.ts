import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { FluxText2ImgPostParams } from "./types";
import { IText2Image } from './IText2Image';
import { MediaFile } from '../../../media-toolkit-js/MediaFile';
/**
 * Client for the FluxSchnell text-to-image model
 */
export declare class FluxSchnell extends ApiClient implements IText2Image {
    constructor();
    /**
     * Register FluxSchnell specific endpoints
     */
    protected registerEndpoints(): void;
    parseResult(full_output: any): Promise<MediaFile | Array<MediaFile> | any>;
    /**
     * Generate an image from a text prompt
     * @param text - Text description of the desired image
     * @param args - Additional arguments (Python *args equivalent)
     * @param kwargs - Additional options (Python **kwargs equivalent)
     * @returns TrackedJob that resolves to the generated image
     */
    text2img(text: string, options?: Partial<FluxText2ImgPostParams>): Promise<TrackedJob<MediaFile | Array<MediaFile> | any>>;
}
