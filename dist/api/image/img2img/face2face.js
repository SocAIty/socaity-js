import { ApiClient } from '../../../core/web/APIClient';
import { MediaFile } from '../../../media-toolkit-js/MediaFile';
import { z } from 'zod';
import { zSwapImgToImgParams, zSwapImgToImgFileParams, zSwapParams, zAddFaceParams, zSwapVideoParams, allowedMediaTypes } from './types';
/**
 * Client for the Face2Face image and video face swapping service
 */
export class Face2Face extends ApiClient {
    constructor() {
        super('face2face');
    }
    /**
     * Register Face2Face specific endpoints
     */
    registerEndpoints() {
        this.registerEndpoint({
            path: 'swap_img_to_img',
            method: 'POST',
            queryParams: zSwapImgToImgParams.parse({}),
            fileParams: zSwapImgToImgFileParams.parse({}),
        });
        this.registerEndpoint({
            path: 'swap',
            method: 'POST',
            queryParams: zSwapParams.parse({}),
            fileParams: z.object({ media: allowedMediaTypes }).parse({}),
        });
        this.registerEndpoint({
            path: 'add_face',
            method: 'POST',
            queryParams: zAddFaceParams.parse({}),
            fileParams: z.object({ image: allowedMediaTypes }).parse({}),
        });
        this.registerEndpoint({
            path: 'swap_video',
            method: 'POST',
            queryParams: zSwapVideoParams.parse({}),
            fileParams: z.object({ target_video: allowedMediaTypes }).parse({}),
        });
    }
    async parseResult(full_output) {
        if (Array.isArray(full_output)) {
            return Promise.all(full_output.map((file) => new MediaFile().fromAny(file)));
        }
        return await new MediaFile().fromAny(full_output);
    }
    /**
     * Swap faces between a source image and target image
     * @param sourceImg - Source image containing the face to use
     * @param targetImg - Target image where the face will be swapped
     * @param options - Additional options like enhance_face_model
     * @returns TrackedJob that resolves to the processed image
     */
    async swapImg2Img(sourceImg, targetImg, options) {
        const endpoint = this.getEndpoint('swap-img-to-img');
        // Convert inputs to MediaFile if they're strings
        const sourceMediaFile = await MediaFile.create(sourceImg);
        const targetMediaFile = await MediaFile.create(targetImg);
        if (!sourceMediaFile || !targetMediaFile) {
            throw new Error('Invalid source or target image');
        }
        let queryParams = zSwapImgToImgParams.parse(options || {});
        let fileParams = zSwapImgToImgFileParams.parse({ source_img: sourceMediaFile, target_img: targetMediaFile });
        let params = { ...queryParams, ...fileParams };
        return this.submitTrackedJob(endpoint, params, this.parseResult);
    }
    /**
     * Apply face swapping on a single image with predefined faces
     * @param media - Image where faces should be swapped
     * @param options - Options including which faces to use and enhance settings
     * @returns TrackedJob that resolves to the processed image
     */
    async swap(media, options) {
        const endpoint = this.getEndpoint('swap');
        const mediaFile = await MediaFile.create(media);
        if (!mediaFile) {
            throw new Error('Invalid media file');
        }
        const QueryParams = zSwapParams.parse(options || {});
        const fileParams = { media: mediaFile };
        const params = { ...QueryParams, ...fileParams };
        return this.submitTrackedJob(endpoint, params, this.parseResult);
    }
    /**
     * Add a face to the face library for later use in swapping
     * @param image - Image containing the face to add
     * @param options - Options including the face name and whether to save it
     * @returns TrackedJob that resolves to the operation result
     */
    async addFace(image, faceName, save = true) {
        const endpoint = this.getEndpoint('add_face');
        const imageFile = await MediaFile.create(image);
        if (!imageFile) {
            throw new Error('Invalid image file');
        }
        const params = zAddFaceParams.parse({
            image: imageFile.toBase64(),
            face_name: faceName,
            save
        });
        return this.submitTrackedJob(endpoint, params, this.parseResult);
    }
    /**
     * Swap faces in a video using a previously added face
     * @param targetVideo - Video where faces should be swapped
     * @param faceName - Name of the face to use (previously added with addFace)
     * @param options - Additional options like include_audio and enhance settings
     * @returns TrackedJob that resolves to the processed video
     */
    async swapVideo(targetVideo, faceName, options) {
        const endpoint = this.getEndpoint('swap_video');
        const videoFile = await MediaFile.create(targetVideo);
        if (!videoFile) {
            throw new Error('Invalid video file');
        }
        const params = zSwapVideoParams.parse({
            face_name: faceName,
            ...options
        });
        const fileData = { target_video: videoFile };
        return this.submitTrackedJob(endpoint, params, this.parseResult);
    }
}
//# sourceMappingURL=face2face.js.map