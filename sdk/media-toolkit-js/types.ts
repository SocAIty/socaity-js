/**
 * Interface representing a file result with metadata and content.
 * Used for serialization and deserialization of MediaFile objects.
 */
export interface FileResult {
    /**
     * The name of the file
     */
    file_name: string;

    /**
     * The MIME type of the file content
     */
    
    content_type: string;
    /**
     * The file content, typically as a base64 encoded string,
     * but can also be provided as other formats like ArrayBuffer,
     * Blob, or URL that will be processed by MediaFile
     */
    content: string | ArrayBuffer | Blob | any;
  }

/**
 * Check if an object is a FileResult.
 * 
 * @param obj - Object to check
 * @returns Whether the object is a FileResult
 * @private
 */
export function isFileResult(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    'file_name' in obj &&
    'content_type' in obj &&
    'content' in obj
  );
}