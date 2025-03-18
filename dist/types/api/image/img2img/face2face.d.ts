import { IFaceSwap } from './IFaceSwap';
import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { MediaFile } from '../../../media-toolkit-js/MediaFile';
import { SwapImgToImgParams, SwapParams, SwapVideoParams } from './types';
/**
 * Client for the Face2Face image and video face swapping service
 */
export declare class Face2Face extends ApiClient implements IFaceSwap {
    constructor();
    /**
     * Register Face2Face specific endpoints
     */
    protected registerEndpoints(): void;
    parseResult(full_output: any): Promise<MediaFile | Array<MediaFile> | any>;
    /**
     * Swap faces between a source image and target image
     * @param sourceImg - Source image containing the face to use
     * @param targetImg - Target image where the face will be swapped
     * @param options - Additional options like enhance_face_model
     * @returns TrackedJob that resolves to the processed image
     */
    swapImg2Img(sourceImg: MediaFile | string, targetImg: MediaFile | string, options?: Partial<SwapImgToImgParams>): Promise<TrackedJob<MediaFile>>;
    /**
     * Apply face swapping on a single image with predefined faces
     * @param media - Image where faces should be swapped
     * @param options - Options including which faces to use and enhance settings
     * @returns TrackedJob that resolves to the processed image
     */
    swap(media: MediaFile | string, options?: Partial<SwapParams>): Promise<TrackedJob<MediaFile>>;
    /**
     * Add a face to the face library for later use in swapping
     * @param image - Image containing the face to add
     * @param options - Options including the face name and whether to save it
     * @returns TrackedJob that resolves to the operation result
     */
    addFace(image: MediaFile | string, faceName: string, save?: boolean): Promise<TrackedJob<any>>;
    /**
     * Swap faces in a video using a previously added face
     * @param targetVideo - Video where faces should be swapped
     * @param faceName - Name of the face to use (previously added with addFace)
     * @param options - Additional options like include_audio and enhance settings
     * @returns TrackedJob that resolves to the processed video
     */
    swapVideo(targetVideo: MediaFile | string, faceName: string, options?: Partial<Omit<SwapVideoParams, 'face_name'>>): Promise<TrackedJob<MediaFile>>;
}
