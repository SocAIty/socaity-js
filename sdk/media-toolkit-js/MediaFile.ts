// src/MediaFile.ts
import { FileResult, isFileResult } from './types';
import { isUrl, isBase64Data } from './utils';

/**
 * A class for standardized file handling across browser and Node.js environments.
 * Provides methods to load files from various sources and convert between formats.
 */
export class MediaFile {
  protected content_type: string;
  protected file_name: string;
  protected _content: ArrayBuffer | null = null;
  protected _isNode: boolean;

  /**
   * Creates a new MediaFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use
   */
  constructor(file_name: string = "file", content_type: string = "application/octet-stream") {
    this.content_type = content_type;
    this.file_name = file_name;
    this._isNode = typeof window === 'undefined';
  }

  /**
   * Factory method to create a MediaFile from any supported data type.
   * Automatically detects data type and uses the appropriate method.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to a MediaFile instance or null
   */
  static async create(data: any): Promise<MediaFile> {
    if (data === null || data === undefined) {
      throw new Error('Cannot create MediaFile from null or undefined data');
    }

    const mediaFile = new MediaFile();
    return mediaFile.fromAny(data);
  }

  /**
   * Load a file from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @param websafe - Prevents loading from file paths and malformatted base64 strings.
   * @returns Promise resolving to a MediaFile instance or null
   */
  async fromAny(data: any): Promise<MediaFile> {
    // Already a MediaFile
    if (data instanceof MediaFile) {
      return data;
    }

    // Node.js Buffer
    if (this._isNode && this._isBuffer(data)) {
      return this.fromBytes(data);
    }

    // Browser Blob
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      const buffer = await data.arrayBuffer();
      return this.fromBytes(buffer);
    }

    // ArrayBuffer
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      return this.fromBytes(data);
    }

    // String data (path, URL, or base64)
    if (typeof data === 'string') {
      if (isUrl(data)) {
        return await this.fromUrl(data);
      } 
      else if (isBase64Data(data)) {
        return this.fromBase64(data);
      }
      else if (await this._isValidFilePath(data)) {
        return await this.fromFile(data);
      } 
      else {
        throw new Error('Invalid data type for MediaFile');
          //try {
          //  return this.fromBase64(data);
          //} catch (e) {
          //  console.error(`Could not process string data: ${data.substring(0, 50)}...`);
          //  return null;
          //}
      }
    }
    

    // Handle FileResult object
    if (isFileResult(data)) {
      return await this.fromDict(data);
    }

    return this;
  }

  /**
   * Load file from a file path (Node.js only).
   * 
   * @param filePath - Path to the file
   * @returns Promise resolving to the MediaFile instance
   */
  async fromFile(filePath: string): Promise<MediaFile> {
    if (!this._isNode) {
      throw new Error('Loading from file path is only supported in Node.js environment');
    }

    try {
      // Dynamic import to avoid bundling issues in browsers
      const fs = await import('fs/promises');
      const buffer = await fs.readFile(filePath);
      const path = await import('path');

      this.file_name = path.basename(filePath);
      this._content = this._bufferToArrayBuffer(buffer);
      this._setContentTypeFromFileName();
      
      return this;
    } catch (error) {
      throw new Error(`Failed to load file from path: ${filePath}. ${(error as Error).message}`);
    }
  }

  /**
   * Load file from a URL.
   * 
   * @param url - URL to fetch the file from
   * @param headers - Optional headers for the request
   * @returns Promise resolving to the MediaFile instance
   */
  async fromUrl(url: string, headers?: Record<string, string>): Promise<MediaFile> {
    try {
      const response = await fetch(url, {
        headers: headers || {
          'User-Agent': 'MediaFile/1.0.0'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Get content type from response headers
      this.content_type = response.headers.get('content-type') || 'application/octet-stream';
      
      // Try to get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=(?:['"]?)([^'";\n]+)/i);
        if (fileNameMatch && fileNameMatch[1]) {
          this.file_name = fileNameMatch[1];
        }
      }
      
      // If no filename from header, use the URL path
      if (!this.file_name || this.file_name === 'file') {
        const urlObj = new URL(url);
        // Extract filename from the URL path without using Node's path module
        const pathSegments = urlObj.pathname.split('/');
        const fileName = pathSegments[pathSegments.length - 1]; // Get the last segment
        
        if (fileName && fileName.trim() !== '') {
          this.file_name = decodeURIComponent(fileName);
        } else {
          // Fallback filename if path is empty or ends with a slash
          this.file_name = 'downloaded_file';
        }
      }
  
      // Get content as ArrayBuffer
      this._content = await response.arrayBuffer();
      return this;
    } catch (error) {
      throw new Error(`Failed to load file from URL: ${url}. ${(error as Error).message}`);
    }
  }
  /**
   * Load file from base64 encoded string.
   * 
   * @param base64Data - Base64 encoded string, optionally with data URI prefix
   * @returns The MediaFile instance
   */
  fromBase64(base64Data: string): MediaFile {
    const { data, mediaType } = this._parseBase64Uri(base64Data);
    
    // Update content type if available from data URI
    if (mediaType) {
      this.content_type = mediaType;
    }

    try {
      // Decode base64 to binary data
      this._content = this._isNode 
        ? this._decodeBase64NodeJs(data)
        : this._decodeBase64Browser(data);
      
      return this;
    } catch (error) {
      throw new Error(`Failed to decode base64 data: ${(error as Error).message}`);
    }
  }

  /**
   * Load file from binary data.
   * 
   * @param data - ArrayBuffer, Buffer, or Uint8Array containing the file data
   * @returns The MediaFile instance
   */
  fromBytes(data: ArrayBuffer | Buffer | ArrayBufferLike | SharedArrayBuffer | Uint8Array): MediaFile {
    if (data instanceof SharedArrayBuffer) {
      // Create a proper ArrayBuffer copy from SharedArrayBuffer
      const tempView = new Uint8Array(data);
      const arrayBuffer = new ArrayBuffer(tempView.byteLength);
      new Uint8Array(arrayBuffer).set(tempView);
      this._content = arrayBuffer;
      return this;
    }
    
    if (data instanceof Uint8Array) {
      // Check if the underlying buffer is a SharedArrayBuffer
      if (data.buffer instanceof SharedArrayBuffer) {
        // Create a new ArrayBuffer copy
        const tempBuffer = new Uint8Array(data);
        this._content = tempBuffer.buffer.slice(tempBuffer.byteOffset, tempBuffer.byteOffset + tempBuffer.byteLength);
      } else {
        this._content = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      }
    } else if (this._isNode && Buffer.isBuffer(data)) {
      // Check if the underlying buffer is a SharedArrayBuffer
      if (data.buffer instanceof SharedArrayBuffer) {
        // Create a new ArrayBuffer copy
        const tempBuffer = new Uint8Array(data);
        this._content = tempBuffer.buffer.slice(tempBuffer.byteOffset, tempBuffer.byteOffset + tempBuffer.byteLength);
      } else {
        this._content = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      }
    } else {
      // At this point, data should be an ArrayBuffer or ArrayBufferLike
      // Create a defensive copy to ensure it's an ArrayBuffer
      this._content = new Uint8Array(data as ArrayBuffer).buffer;
    }
    return this;
  }
  
  /**
   * Load file from a FileResult object.
   * 
   * @param fileResult - FileResult object with file metadata and base64 content
   * @returns The MediaFile instance
   */
  async fromDict(fileResult: FileResult): Promise<MediaFile> {
    if (!fileResult.content) {
      throw new Error('Invalid FileResult object: missing content');
    }
    this.file_name = fileResult.file_name;
    this.content_type = fileResult.content_type;
    return await this.fromAny(fileResult.content);
  }

  /**
   * Convert the file to a Blob (browser only).
   * 
   * @returns Blob object representing the file
   */
  toBlob(): Blob {
    this._ensureContent();
    
    if (typeof Blob === 'undefined') {
      throw new Error('Blob is not available in this environment');
    }
    
    return new Blob([new Uint8Array(this._content!)], { type: this.content_type });
  }
  /**
   * Convert the file to an ArrayBuffer.
   * 
   * @returns ArrayBuffer containing the file data
   */
  toArrayBuffer(): ArrayBuffer {
    this._ensureContent();
    
    if (this._content instanceof SharedArrayBuffer) {
      return this._content.slice(0); // Convert SharedArrayBuffer to ArrayBuffer
    }
  
    return this._content!;
  }

  /**
   * Convert the file to a Uint8Array.
   * 
   * @returns Uint8Array containing the file data
   */
  toUint8Array(): Uint8Array {
    this._ensureContent();
    return new Uint8Array(this._content!);
  }

  /**
   * Convert the file to a Node.js Buffer (Node.js only).
   * 
   * @returns Buffer containing the file data
   */
  toBuffer(): Buffer {
    this._ensureContent();
    
    if (!this._isNode) {
      throw new Error('Buffer is only available in Node.js environment');
    }
    
    return Buffer.from(this._content!);
  }

  /**
   * Convert the file to a base64 encoded string.
   * 
   * @param includeDataUri - Whether to include the data URI prefix
   * @returns Base64 encoded string of the file data
   */
  toBase64(includeDataUri: boolean = true): string {
    this._ensureContent();
    
    let base64Data: string;
    
    if (this._isNode) {
      base64Data = Buffer.from(this._content!).toString('base64');
    } else {
      const bytes = new Uint8Array(this._content!);
      let binary = '';
      const chunkSize = 10240; // Process in chunks to avoid call stack issues
      
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      base64Data = btoa(binary);
    }
    
    if (includeDataUri) {
      return `data:${this.content_type};base64,${base64Data}`;
    }
    
    return base64Data;
  }

  /**
   * Convert the file to a FileResult object.
   * 
   * @returns FileResult object with file metadata and base64 content
   */
  toJson(): FileResult {
    return {
      file_name: this.file_name,
      content_type: this.content_type,
      content: this.toBase64()
    };
  }

  /**
   * Save the file to disk (Node.js) or trigger download (browser).
   * 
   * @param filePath - Optional file path (Node.js) or filename (browser)
   * @returns Promise that resolves when the file is saved
   */
  async save(filePath?: string): Promise<void> {
    this._ensureContent();
    
    const saveFilename = filePath || this.file_name;
  
    if (this._isNode) {
      // Node.js environment
      try {
        const fs = await import('fs/promises').then(mod => mod.default || mod);
        const path = await import('path').then(mod => mod.default || mod);
        
       // Ensure the path module is properly loaded
        if (!path || typeof path.dirname !== 'function') {
          throw new Error("Failed to load 'path' module.");
        }

        // Create directories if they don't exist
        const directory = path.dirname(saveFilename);
        if (directory !== '.') {
          await fs.mkdir(directory, { recursive: true }).catch(() => {});
        }
        
        await fs.writeFile(saveFilename, Buffer.from(this._content!));
      } catch (error) {
        throw new Error(`Failed to save file: ${(error as Error).message}`);
      }
    } else {
      // Browser environment
      const blob = this.toBlob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = saveFilename;
      
      // Append to document, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  }

  /**
   * Get the file size in bytes.
   * 
   * @param unit - Unit to return the size in ('bytes', 'kb', 'mb', or 'gb')
   * @returns File size in the specified unit
   */
  fileSize(unit: 'bytes' | 'kb' | 'mb' | 'gb' = 'bytes'): number {
    if (!this._content) {
      return 0;
    }
    
    const sizeInBytes = this._content.byteLength;
    
    switch (unit) {
      case 'kb':
        return sizeInBytes / 1024;
      case 'mb':
        return sizeInBytes / (1024 * 1024);
      case 'gb':
        return sizeInBytes / (1024 * 1024 * 1024);
      default:
        return sizeInBytes;
    }
  }

  /**
   * Get the file extension based on the content type or filename.
   * 
   * @returns File extension without the leading dot, or null if it cannot be determined
   */
  get extension(): string | null {
    // Try to get extension from content type first
    if (this.content_type && this.content_type !== 'application/octet-stream') {
      const commonMimeTypes: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg',
        'video/mp4': 'mp4',
        'video/quicktime': 'mov',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'text/html': 'html',
        'application/json': 'json'
      };
      
      if (this.content_type in commonMimeTypes) {
        return commonMimeTypes[this.content_type];
      }
      
      // Try mime-types package in Node.js
      if (this._isNode) {
        try {
          // Dynamic import to avoid bundling issues in browsers
          const nodeMimeTypes = require('mime-types');
          const ext = nodeMimeTypes.extension(this.content_type);
          if (ext) return ext;
        } catch (e) {
          // If mime-types is not available, continue with filename check
        }
      }
    }
    
    // Try to get extension from filename
    if (this.file_name && this.file_name.includes('.')) {
      return this.file_name.split('.').pop()?.toLowerCase() || null;
    }
    
    return null;
  }

  /**
   * Get the filename.
   */
  getFileName(): string {
    return this.file_name;
  }

  /**
   * Set the filename.
   */
  setFileName(fileName: string): void {
    this.file_name = fileName;
  }

  /**
   * Get the content type.
   */
  getContentType(): string {
    return this.content_type;
  }

  /**
   * Set the content type.
   */
  setContentType(contentType: string): void {
    this.content_type = contentType;
  }

  /**
   * Read raw file data.
   * 
   * @returns ArrayBuffer containing the file data
   */
  read(): ArrayBuffer {
    this._ensureContent();
    return this._content!;
  }

  /**
   * Check if the file is empty.
   * 
   * @returns Boolean indicating if the file has content
   */
  isEmpty(): boolean {
    return !this._content || this._content.byteLength === 0;
  }

  /**
   * Get info about the file.
   * 
   * @returns Object with file information
   */
  getInfo(): { fileName: string; contentType: string; size: number; extension: string | null } {
    return {
      fileName: this.file_name,
      contentType: this.content_type,
      size: this.fileSize(),
      extension: this.extension
    };
  }

  /**
   * Detect MIME type for the file based on file extension.
   * Updates the content_type property.
   * 
   * @private 
   */
  protected _setContentTypeFromFileName(): void {
    if (!this.file_name) return;
    
    const extension = this.file_name.split('.').pop()?.toLowerCase();
    if (!extension) return;
    
    // Try to use mime-types package in Node.js
    if (this._isNode) {
      try {
        const nodeMimeTypes = require('mime-types');
        const mimeType = nodeMimeTypes.lookup(this.file_name);
        if (mimeType) {
          this.content_type = mimeType;
          return;
        }
      } catch (e) {
        // If mime-types is not available, use the static mapping
      }
    }
    
    // Simple extension to MIME type mapping
    const extensionToMime: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'html': 'text/html',
      'htm': 'text/html',
      'json': 'application/json',
      'js': 'application/javascript',
      'css': 'text/css',
      'xml': 'application/xml',
      'zip': 'application/zip'
    };
    
    if (extension in extensionToMime) {
      this.content_type = extensionToMime[extension];
    }
  }

  /**
   * Parse a base64 data URI into content and media type.
   * 
   * @param data - Base64 string, potentially with data URI prefix
   * @returns Object containing the parsed data and media type
   * @private
   */
  protected _parseBase64Uri(data: string): { data: string, mediaType: string | null } {
    // Data URI format: data:[<media type>][;base64],<data>
    if (data.startsWith('data:')) {
      const [header, content] = data.split(',', 2);
      const mediaTypeMatch = header.match(/^data:([^;,]+)/);
      const mediaType = mediaTypeMatch ? mediaTypeMatch[1] : null;
      
      return { data: content, mediaType };
    }
    
    // If no data URI prefix, return the original string
    return { data, mediaType: null };
  }

  /**
   * Ensure content exists before operating on it.
   * 
   * @private
   */
  protected _ensureContent(): void {
    if (!this._content) {
      throw new Error('No content available. Load content first using fromFile, fromUrl, etc.');
    }
  }

  /**
   * Check if a string is a valid file path.
   * 
   * @param path - Path to check
   * @returns Whether the path is valid
   * @private
   */
  protected async _isValidFilePath(path: string): Promise<boolean> {
    if (!this._isNode) {
      return false;
    }
    
    try {
      const fs = await import('fs/promises');
      const stats = await fs.stat(path);
      return stats.isFile();
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if an object is a Buffer.
   * 
   * @param obj - Object to check
   * @returns Whether the object is a Buffer
   * @private
   */
  protected _isBuffer(obj: any): boolean {
    return this._isNode && Buffer.isBuffer(obj);
  }

  /**
   * Decode base64 string in Node.js environment.
   * 
   * @param base64 - Base64 string to decode
   * @returns ArrayBuffer containing the decoded data
   * @private
   */
  protected _decodeBase64NodeJs(base64: string): ArrayBuffer {
    const buffer = Buffer.from(base64, 'base64');
    return this._bufferToArrayBuffer(buffer);
  }

  /**
   * Decode base64 string in browser environment.
   * 
   * @param base64 - Base64 string to decode
   * @returns ArrayBuffer containing the decoded data
   * @private
   */
  protected _decodeBase64Browser(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }

  /**
   * Convert a Node.js Buffer to an ArrayBuffer.
   * 
   * @param buffer - Buffer to convert
   * @returns ArrayBuffer containing the data
   * @private
   */
  private _bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
    // Check if the underlying buffer is a SharedArrayBuffer
    if (buffer.buffer instanceof SharedArrayBuffer) {
      // Create a proper ArrayBuffer copy
      const arrayBuffer = new ArrayBuffer(buffer.byteLength);
      const view = new Uint8Array(arrayBuffer);
      view.set(new Uint8Array(buffer));
      return arrayBuffer;
    } else {
      // For regular ArrayBuffer, we can use slice
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
  }
}

