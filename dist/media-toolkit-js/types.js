/**
 * Check if an object is a FileResult.
 *
 * @param obj - Object to check
 * @returns Whether the object is a FileResult
 * @private
 */
export function isFileResult(obj) {
    return (obj &&
        typeof obj === 'object' &&
        'file_name' in obj &&
        'content_type' in obj &&
        'content' in obj);
}
//# sourceMappingURL=types.js.map