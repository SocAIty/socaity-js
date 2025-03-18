import { z } from "zod";
/**
 * Text to image options
 */
export const zFluxText2ImgParams = z.object({
    prompt: z.string().default(""),
    aspect_ratio: z.string().default("1:1"),
    num_outputs: z.number().int().default(1),
    num_inference_steps: z.number().int().gt(0).lt(5).default(4),
    seed: z.number().int().optional().default(() => Math.floor(Math.random() * 1_000_000)),
    output_format: z.string().default("jpg"),
    disable_safety_checker: z.boolean().default(false),
    go_fast: z.boolean().default(false),
});
//# sourceMappingURL=types.js.map