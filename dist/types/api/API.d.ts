import { Configuration } from '../core/configuration';
import { TrackedJob } from '../core/job/TrackedJob';
import { MediaFile } from '../media-toolkit-js/MediaFile';
export declare class SocaityAPI {
    constructor(configOptions?: Partial<Configuration>);
    text2img(prompt: string, model?: string, options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>>;
    chat(prompt: string, model?: string, options?: Record<string, any>): Promise<TrackedJob<string | any>>;
    swapImg2Img(sourceImg: MediaFile | string, targetImg: MediaFile | string, model?: string, options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>>;
    getAvailableModels(): string[];
}
