import { z } from 'zod';
import { ImageFile } from '@socaity/media-toolkit'

export const allowedMediaTypes = z.union([
  z.string(),
  z.null(),
  z.instanceof(Blob),
  z.instanceof(File),
  z.instanceof(ImageFile),
  // Add Buffer type for Node.js environment
  // z.instanceof(Buffer)
]).default(null);

// Define the parameter schemas for the endpoints
export const zSwapImgToImgParams = z.object({
  enhance_face_model: z.string().optional().default('gpen_bfr_512')
});
export const zSwapImgToImgFileParams= z.object({
  source_img: allowedMediaTypes,
  target_img: allowedMediaTypes,
}); // allows the fields to be initially undefined

export const zSwapParams = z.object({
    faces: z.union([z.string(), z.array(z.string()), z.record(z.string(), z.any())]).default(''),
    enhance_face_model: z.string().optional(),
});

export const zAddFaceParams = z.object({
    face_name: z.string().default(''),
    save: z.boolean().optional().default(false)
});

export const zSwapVideoParams = z.object({
  face_name: z.string().default(''),
  include_audio: z.boolean().optional().default(true),
  enhance_face_model: z.string().optional().default('gpen_bfr_512')
});

// Export the types based on the Zod schemas
export type SwapImgToImgParams = z.infer<typeof zSwapImgToImgParams>;
export type SwapParams = z.infer<typeof zSwapParams>;
export type AddFaceParams = z.infer<typeof zAddFaceParams>;
export type SwapVideoParams = z.infer<typeof zSwapVideoParams>;
