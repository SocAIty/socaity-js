import { Configuration } from '../core/configuration';
import { FluxSchnell } from './image/text2img/FluxSchnell';
import { TrackedJob } from '../core/job/TrackedJob';
import { IText2Image } from './image/text2img/IText2Image';
import { MediaFile } from '../media-toolkit-js/MediaFile';
import { DeepSeekR1 } from './text/chat/deepseekr1';
import { APIClientFactory } from '../core/web/APIClientFactory';
import { IChat } from './text/chat/BaseChat';
import { IFaceSwap } from './image/img2img/IFaceSwap';
import { Face2Face } from './image/img2img/face2face';

// SimpleAPI class that supports multiple models
// Register available client types
APIClientFactory.registerClientType('flux-schnell', FluxSchnell);
APIClientFactory.registerClientType('deepseek-r1', DeepSeekR1);
APIClientFactory.registerClientType('face2face', Face2Face);

// API.ts - Simplified API interface
export class SocaityAPI {
  constructor(configOptions: Partial<Configuration> = {}) {
    Configuration.update(configOptions);
  }
  
  async text2img(prompt: string, model: string = 'flux-schnell', options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>> {
    const client = APIClientFactory.getClient<IText2Image | FluxSchnell>(model);
    return client.text2img(prompt, options);
  }
  
  async chat(prompt: string, model: string = 'deepseek-r1', options?: Record<string, any>): Promise<TrackedJob<string | any>> {
    const client = APIClientFactory.getClient<IChat | DeepSeekR1>(model);
    return client.chat(prompt, options);
  }

  async swapImg2Img(sourceImg: MediaFile | string, targetImg: MediaFile | string, model: string = 'face2face', options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>> {
    const client = APIClientFactory.getClient<IFaceSwap>(model);
    return client.swapImg2Img(sourceImg, targetImg, options);
  }
  
  getAvailableModels(): string[] {
    return APIClientFactory.getAvailableClients();
  }
}

