import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { DeepSeekR1Params, zDeepSeekR1Params } from "../types";
import { IChat } from './IChat';


export class DeepSeekResult {
  answer: string;
  thoughts: string;
  constructor(full_output: Array<string> | string) {
    if (Array.isArray(full_output)) {
      full_output = full_output.join("")
    }
    let pos_think = full_output.indexOf("<think>")
    let end_think = full_output.indexOf("</think>", pos_think+7)
    this.thoughts = full_output.substring(pos_think+7, end_think)
    this.answer = full_output.substring(end_think+8)
  }
}

/**
 * Client for the FluxSchnell text-to-image model
 */
export class DeepSeekR1 extends ApiClient implements IChat {
  constructor() {
    super('deepseek-r1');
  }
  /**
   * Register FluxSchnell specific endpoints
   */
  protected registerEndpoints(): void {
    this.registerEndpoint({
      path: 'chat',
      method: 'POST',
      queryParams: zDeepSeekR1Params.parse({}),
    });
  }

  async _parse_result(full_output: any): Promise<DeepSeekResult> {
    return new DeepSeekResult(full_output);
  }
  
  async _infer(prompt: string, options?: Partial<DeepSeekR1Params>): Promise<TrackedJob<DeepSeekResult>> {
    // Get endpoint details
    const endpoint = this.getEndpoint('chat');
    
    // Create a complete params object with user options and defaults
    const params = zDeepSeekR1Params.parse({
      ...options,
      prompt: prompt,  // Always use the text parameter as the prompt
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
  async chat(prompt: string, options?: Partial<DeepSeekR1Params>): Promise<TrackedJob<string>> {
    const job = await this._infer(prompt, options);
    return job.answer;
  }
}
