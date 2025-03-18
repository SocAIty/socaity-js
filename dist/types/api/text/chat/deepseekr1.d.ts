import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { DeepSeekR1Params } from "../types";
import { IChat } from './BaseChat';
export declare class DeepSeekResult {
    answer: string;
    thoughts: string;
    constructor(full_output: Array<string> | string);
}
/**
 * Client for the FluxSchnell text-to-image model
 */
export declare class DeepSeekR1 extends ApiClient implements IChat {
    constructor();
    /**
     * Register FluxSchnell specific endpoints
     */
    protected registerEndpoints(): void;
    _parse_result(full_output: any): Promise<DeepSeekResult>;
    _infer(prompt: string, options?: Partial<DeepSeekR1Params>): Promise<TrackedJob<DeepSeekResult>>;
    /**
     * Generate a chat response from a text prompt
     * @param prompt - Text prompt for the chat model
     * @param options - Additional options for the request
     * @returns Promise that resolves to the generated response text
     */
    chat(prompt: string, options?: Partial<DeepSeekR1Params>): Promise<TrackedJob<string>>;
}
