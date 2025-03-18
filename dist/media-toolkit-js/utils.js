/**
* Check if a string is a URL.
*
* @param url - URL to check
* @returns Whether the string is a URL
* @private
*/
export function isUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch (e) {
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
export function isBase64Data(data) {
    return data.startsWith('data:') || isBase64String(data);
}
/**
* Check if a string appears to be base64 encoded.
*
* @param str - String to check
* @returns Whether the string is base64 encoded
* @private
*/
export function isBase64String(str) {
    const regex = /^[A-Za-z0-9+/=]+$/;
    return regex.test(str) && str.length % 4 === 0;
}
//# sourceMappingURL=utils.js.map