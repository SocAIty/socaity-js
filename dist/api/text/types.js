import { z } from "zod";
/**
 * Text to image options
 */
export const zDeepSeekR1Params = z.object({
    prompt: z.string().default(""),
    max_tokens: z.number().int().default(20480),
    temperature: z.number().gt(0).lt(1).default(0.1),
    presence_penalty: z.number().gte(0).lte(1).default(0.0),
    frequency_penalty: z.number().gte(0).lte(1).default(0.0),
    top_p: z.number().gte(0).lte(1).default(1.0),
});
//# sourceMappingURL=types.js.map