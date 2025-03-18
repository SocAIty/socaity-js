import { FileResult } from './types';
/**
 * A class for standardized file handling across browser and Node.js environments.
 * Provides methods to load files from various sources and convert between formats.
 */
export declare class MediaFile {
    protected content_type: string;
    protected file_name: string;
    protected _content: ArrayBuffer | null;
    protected _isNode: boolean;
    /**
     * Creates a new MediaFile instance.
     *
     * @param file_name - Default filename to use
     * @param content_type - Default content type to use
     */
    constructor(file_name?: string, content_type?: string);
    /**
     * Factory method to create a MediaFile from any supported data type.
     * Automatically detects data type and uses the appropriate method.
     *
     * @param data - Data to load (file path, URL, base64 string, etc.)
     * @returns Promise resolving to a MediaFile instance or null
     */
    static create(data: any): Promise<MediaFile>;
    /**
     * Load a file from any supported data type.
     *
     * @param data - Data to load (file path, URL, base64 string, etc.)
     * @param websafe - Prevents loading from file paths and malformatted base64 strings.
     * @returns Promise resolving to a MediaFile instance or null
     */
    fromAny(data: any): Promise<MediaFile>;
    /**
    Load a file from any supported data type, with additional checks for websafe content.
    Prevents loading from file paths and malformatted base64 strings.
    @param data - Data to load (file path, URL, base64 string, etc.)
    @returns Promise resolving to a MediaFile instance or null
    */
    fromAnyWebsafe(data: any): Promise<MediaFile | null | any>;
    /**
     * Load file from a file path (Node.js only).
     *
     * @param filePath - Path to the file
     * @returns Promise resolving to the MediaFile instance
     */
    fromFile(filePath: string): Promise<MediaFile>;
    /**
     * Load file from a URL.
     *
     * @param url - URL to fetch the file from
     * @param headers - Optional headers for the request
     * @returns Promise resolving to the MediaFile instance
     */
    fromUrl(url: string, headers?: Record<string, string>): Promise<MediaFile>;
    /**
     * Load file from base64 encoded string.
     *
     * @param base64Data - Base64 encoded string, optionally with data URI prefix
     * @returns The MediaFile instance
     */
    fromBase64(base64Data: string): MediaFile;
    /**
     * Load file from binary data.
     *
     * @param data - ArrayBuffer, Buffer, or Uint8Array containing the file data
     * @returns The MediaFile instance
     */
    fromBytes(data: ArrayBuffer | Buffer | ArrayBufferLike | SharedArrayBuffer | Uint8Array): MediaFile;
    /**
     * Load file from a FileResult object.
     *
     * @param fileResult - FileResult object with file metadata and base64 content
     * @returns The MediaFile instance
     */
    fromDict(fileResult: FileResult): Promise<MediaFile>;
    /**
     * Convert the file to a Blob (browser only).
     *
     * @returns Blob object representing the file
     */
    toBlob(): Blob;
    /**
     * Convert the file to an ArrayBuffer.
     *
     * @returns ArrayBuffer containing the file data
     */
    toArrayBuffer(): ArrayBuffer;
    /**
     * Convert the file to a Uint8Array.
     *
     * @returns Uint8Array containing the file data
     */
    toUint8Array(): Uint8Array;
    /**
     * Convert the file to a Node.js Buffer (Node.js only).
     *
     * @returns Buffer containing the file data
     */
    toBuffer(): Buffer;
    /**
     * Convert the file to a base64 encoded string.
     *
     * @param includeDataUri - Whether to include the data URI prefix
     * @returns Base64 encoded string of the file data
     */
    toBase64(includeDataUri?: boolean): string;
    /**
     * Convert the file to a FileResult object.
     *
     * @returns FileResult object with file metadata and base64 content
     */
    toJson(): FileResult;
    /**
     * Save the file to disk (Node.js) or trigger download (browser).
     *
     * @param filePath - Optional file path (Node.js) or filename (browser)
     * @returns Promise that resolves when the file is saved
     */
    save(filePath?: string): Promise<void>;
    /**
     * Get the file size in bytes.
     *
     * @param unit - Unit to return the size in ('bytes', 'kb', 'mb', or 'gb')
     * @returns File size in the specified unit
     */
    fileSize(unit?: 'bytes' | 'kb' | 'mb' | 'gb'): number;
    /**
     * Get the file extension based on the content type or filename.
     *
     * @returns File extension without the leading dot, or null if it cannot be determined
     */
    get extension(): string | null;
    /**
     * Get the filename.
     */
    getFileName(): string;
    /**
     * Set the filename.
     */
    setFileName(fileName: string): void;
    /**
     * Get the content type.
     */
    getContentType(): string;
    /**
     * Set the content type.
     */
    setContentType(contentType: string): void;
    /**
     * Read raw file data.
     *
     * @returns ArrayBuffer containing the file data
     */
    read(): ArrayBuffer;
    /**
     * Check if the file is empty.
     *
     * @returns Boolean indicating if the file has content
     */
    isEmpty(): boolean;
    /**
     * Get info about the file.
     *
     * @returns Object with file information
     */
    getInfo(): {
        fileName: string;
        contentType: string;
        size: number;
        extension: string | null;
    };
    /**
     * Detect MIME type for the file based on file extension.
     * Updates the content_type property.
     *
     * @private
     */
    protected _setContentTypeFromFileName(): void;
    /**
     * Parse a base64 data URI into content and media type.
     *
     * @param data - Base64 string, potentially with data URI prefix
     * @returns Object containing the parsed data and media type
     * @private
     */
    protected _parseBase64Uri(data: string): {
        data: string;
        mediaType: string | null;
    };
    /**
     * Ensure content exists before operating on it.
     *
     * @private
     */
    protected _ensureContent(): void;
    /**
     * Check if a string is a valid file path.
     *
     * @param path - Path to check
     * @returns Whether the path is valid
     * @private
     */
    protected _isValidFilePath(path: string): Promise<boolean>;
    /**
     * Check if an object is a Buffer.
     *
     * @param obj - Object to check
     * @returns Whether the object is a Buffer
     * @private
     */
    protected _isBuffer(obj: any): boolean;
    /**
     * Decode base64 string in Node.js environment.
     *
     * @param base64 - Base64 string to decode
     * @returns ArrayBuffer containing the decoded data
     * @private
     */
    protected _decodeBase64NodeJs(base64: string): ArrayBuffer;
    /**
     * Decode base64 string in browser environment.
     *
     * @param base64 - Base64 string to decode
     * @returns ArrayBuffer containing the decoded data
     * @private
     */
    protected _decodeBase64Browser(base64: string): ArrayBuffer;
    /**
     * Convert a Node.js Buffer to an ArrayBuffer.
     *
     * @param buffer - Buffer to convert
     * @returns ArrayBuffer containing the data
     * @private
     */
    private _bufferToArrayBuffer;
}
/**
 * ImageFile class extending MediaFile for image-specific functionality.
 * Example of inheritance capabilities.
 */
export declare class ImageFile extends MediaFile {
    constructor(file_name?: string, content_type?: string);
    /**
     * Check if the file is an image.
     *
     * @returns Boolean indicating if the file has an image MIME type
     */
    isImage(): boolean;
    /**
     * Get image dimensions (when implemented in a real-world scenario).
     * This is just a placeholder showing inheritance capabilities.
     */
    getDimensions(): Promise<{
        width: number;
        height: number;
    } | null>;
}
