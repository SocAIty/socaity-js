import { z } from "zod";
/**
 * Text to image options
 */
export declare const zFluxText2ImgParams: z.ZodObject<{
    prompt: z.ZodDefault<z.ZodString>;
    aspect_ratio: z.ZodDefault<z.ZodString>;
    num_outputs: z.ZodDefault<z.ZodNumber>;
    num_inference_steps: z.ZodDefault<z.ZodNumber>;
    seed: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    output_format: z.ZodDefault<z.ZodString>;
    disable_safety_checker: z.ZodDefault<z.ZodBoolean>;
    go_fast: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    aspect_ratio: string;
    num_outputs: number;
    num_inference_steps: number;
    seed: number;
    output_format: string;
    disable_safety_checker: boolean;
    go_fast: boolean;
}, {
    prompt?: string | undefined;
    aspect_ratio?: string | undefined;
    num_outputs?: number | undefined;
    num_inference_steps?: number | undefined;
    seed?: number | undefined;
    output_format?: string | undefined;
    disable_safety_checker?: boolean | undefined;
    go_fast?: boolean | undefined;
}>;
export type FluxText2ImgPostParams = z.infer<typeof zFluxText2ImgParams>;
