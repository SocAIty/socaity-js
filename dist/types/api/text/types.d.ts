import { z } from "zod";
/**
 * Text to image options
 */
export declare const zDeepSeekR1Params: z.ZodObject<{
    prompt: z.ZodDefault<z.ZodString>;
    max_tokens: z.ZodDefault<z.ZodNumber>;
    temperature: z.ZodDefault<z.ZodNumber>;
    presence_penalty: z.ZodDefault<z.ZodNumber>;
    frequency_penalty: z.ZodDefault<z.ZodNumber>;
    top_p: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    max_tokens: number;
    temperature: number;
    presence_penalty: number;
    frequency_penalty: number;
    top_p: number;
}, {
    prompt?: string | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
    presence_penalty?: number | undefined;
    frequency_penalty?: number | undefined;
    top_p?: number | undefined;
}>;
export type DeepSeekR1Params = z.infer<typeof zDeepSeekR1Params>;
