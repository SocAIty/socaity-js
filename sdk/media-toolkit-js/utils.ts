import { FileResult, isFileResult } from './types';
import { MediaFile } from './MediaFile';
/**
* Check if a string is a URL.
* 
* @param url - URL to check
* @returns Whether the string is a URL
* @private
*/
export function isUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

/**
 * Check if a string is a base64 data URI.
 * 
 * @param data - String to check
 * @returns Whether the string is a base64 data URI
 * @private
 */
export function isBase64Data(data: string): boolean {
  return data.startsWith('data:') || isBase64String(data);
}

/**
* Check if a string appears to be base64 encoded.
* 
* @param str - String to check
* @returns Whether the string is base64 encoded
* @private
*/
export function isBase64String(str: string): boolean {
    const regex = /^[A-Za-z0-9+/=]+$/;
    return regex.test(str) && str.length % 4 === 0;
}

  /**
   * Parses the result data from a Socaity API job.
   * Handles nested arrays and FileResult objects.
   * @param result - Result data to parse
   */
export async function parseSocaityAPIJobResult(result: Array<string> | Array<FileResult> | FileResult | any): Promise<MediaFile | Array<MediaFile> | null | any> {
    if (result === undefined || result === null) {
      return null;
    }

    // Handle arrays of results
    if (Array.isArray(result)) {
      const parsedResults = result.map(item => parseSocaityAPIJobResult(item));
      return Promise.all(parsedResults);
    }
    
    // Handle file results
    if (isFileResult(result)) {
      try {
        return await new MediaFile().fromDict(result as FileResult);
      } catch (e) {
        // If media file parsing fails, return the original result
        return result;
      }
    }
    
    // Return other result types as is
    return result;
}