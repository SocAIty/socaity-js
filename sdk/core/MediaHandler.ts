// src/media-handler.ts
/**
 * Handles processing of media responses
 */
export class MediaHandler {
    /**
     * Process a response that might contain media data
     */
    processResponse(response: any): any {
      if (!response) return null;
      
      // Handle base64 image data
      if (typeof response === 'string' && response.startsWith('data:image')) {
        return this.processImage(response);
      }
      
      // Handle binary data
      if (response instanceof ArrayBuffer || response instanceof Blob) {
        return this.processBinaryData(response);
      }
      
      // Handle response objects with media content
      if (typeof response === 'object' && response !== null) {
        if (response.image_base64 || response.imageBase64) {
          return this.processImage(response.image_base64 || response.imageBase64);
        }
        
        if (response.image_url || response.imageUrl) {
          return {
            url: response.image_url || response.imageUrl,
            ...response
          };
        }
      }
      
      // Return unmodified response if no media processing is needed
      return response;
    }
    
    /**
     * Process image data from the API
     */
    private processImage(imageData: string): any {
      // For browser environments, we can create an image object
      if (typeof document !== 'undefined') {
        const img = new Image();
        img.src = imageData;
        return {
          data: imageData,
          element: img,
          appendTo: (element: HTMLElement) => {
            element.appendChild(img);
            return img;
          }
        };
      }
      
      // For Node.js environments, just return the data
      return { data: imageData };
    }
    
    /**
     * Process binary data from the API
     */
    private processBinaryData(data: ArrayBuffer | Blob): any {
      if (typeof Blob !== 'undefined' && data instanceof Blob) {
        return {
          data,
          toURL: () => URL.createObjectURL(data),
          toBase64: async () => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(data);
            });
          }
        };
      }
      
      return { data };
    }
  }