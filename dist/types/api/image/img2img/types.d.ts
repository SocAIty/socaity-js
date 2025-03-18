import { z } from 'zod';
import { MediaFile } from '../../../media-toolkit-js';
export declare const allowedMediaTypes: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNull, z.ZodType<Blob, z.ZodTypeDef, Blob>, z.ZodType<File, z.ZodTypeDef, File>, z.ZodType<MediaFile, z.ZodTypeDef, MediaFile>, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>]>>;
export declare const zSwapImgToImgParams: z.ZodObject<{
    enhance_face_model: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    enhance_face_model: string;
}, {
    enhance_face_model?: string | undefined;
}>;
export declare const zSwapImgToImgFileParams: z.ZodObject<{
    source_img: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNull, z.ZodType<Blob, z.ZodTypeDef, Blob>, z.ZodType<File, z.ZodTypeDef, File>, z.ZodType<MediaFile, z.ZodTypeDef, MediaFile>, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>]>>;
    target_img: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodNull, z.ZodType<Blob, z.ZodTypeDef, Blob>, z.ZodType<File, z.ZodTypeDef, File>, z.ZodType<MediaFile, z.ZodTypeDef, MediaFile>, z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>]>>;
}, "strip", z.ZodTypeAny, {
    source_img: string | Blob | File | MediaFile | Buffer<ArrayBufferLike> | null;
    target_img: string | Blob | File | MediaFile | Buffer<ArrayBufferLike> | null;
}, {
    source_img?: string | Blob | File | MediaFile | Buffer<ArrayBufferLike> | null | undefined;
    target_img?: string | Blob | File | MediaFile | Buffer<ArrayBufferLike> | null | undefined;
}>;
export declare const zSwapParams: z.ZodObject<{
    faces: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">, z.ZodRecord<z.ZodString, z.ZodAny>]>>;
    enhance_face_model: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    faces: string | string[] | Record<string, any>;
    enhance_face_model?: string | undefined;
}, {
    enhance_face_model?: string | undefined;
    faces?: string | string[] | Record<string, any> | undefined;
}>;
export declare const zAddFaceParams: z.ZodObject<{
    face_name: z.ZodDefault<z.ZodString>;
    save: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    face_name: string;
    save: boolean;
}, {
    face_name?: string | undefined;
    save?: boolean | undefined;
}>;
export declare const zSwapVideoParams: z.ZodObject<{
    face_name: z.ZodDefault<z.ZodString>;
    include_audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    enhance_face_model: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    enhance_face_model: string;
    face_name: string;
    include_audio: boolean;
}, {
    enhance_face_model?: string | undefined;
    face_name?: string | undefined;
    include_audio?: boolean | undefined;
}>;
export type SwapImgToImgParams = z.infer<typeof zSwapImgToImgParams>;
export type SwapParams = z.infer<typeof zSwapParams>;
export type AddFaceParams = z.infer<typeof zAddFaceParams>;
export type SwapVideoParams = z.infer<typeof zSwapVideoParams>;
