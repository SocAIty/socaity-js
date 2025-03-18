import { ApiClient } from '../../../core/web/APIClient';
import { zDeepSeekR1Params } from "../types";
export class DeepSeekResult {
    answer;
    thoughts;
    constructor(full_output) {
        if (Array.isArray(full_output)) {
            full_output = full_output.join("");
        }
        let pos_think = full_output.indexOf("<think>");
        let end_think = full_output.indexOf("</think>", pos_think + 7);
        this.thoughts = full_output.substring(pos_think + 7, end_think);
        this.answer = full_output.substring(end_think + 8);
    }
}
/**
 * Client for the FluxSchnell text-to-image model
 */
export class DeepSeekR1 extends ApiClient {
    constructor() {
        super('deepseek-r1');
    }
    /**
     * Register FluxSchnell specific endpoints
     */
    registerEndpoints() {
        this.registerEndpoint({
            path: 'chat',
            method: 'POST',
            queryParams: zDeepSeekR1Params.parse({}),
        });
    }
    async _parse_result(full_output) {
        return new DeepSeekResult(full_output);
    }
    async _infer(prompt, options) {
        // Get endpoint details
        const endpoint = this.getEndpoint('chat');
        // Create a complete params object with user options and defaults
        const params = zDeepSeekR1Params.parse({
            ...options,
            prompt: prompt, // Always use the text parameter as the prompt
        });
        // Get TrackedJob instance without awaiting
        return this.submitTrackedJob(endpoint, params, this._parse_result);
    }
    /**
     * Generate a chat response from a text prompt
     * @param prompt - Text prompt for the chat model
     * @param options - Additional options for the request
     * @returns Promise that resolves to the generated response text
     */
    async chat(prompt, options) {
        const job = await this._infer(prompt, options);
        return job.answer;
    }
}
//# sourceMappingURL=deepseekr1.js.map