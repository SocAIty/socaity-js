import { Configuration } from '../core/configuration';
import { FluxSchnell } from './image/text2img/FluxSchnell';
import { TrackedJob } from '../core/job/TrackedJob';
import { IText2Image } from './image/text2img/IText2Image';
import { DeepSeekR1 } from './text/chat/deepseekr1';
import { APIClientFactory } from '../core/web/APIClientFactory';
import { IChat } from './text/chat/IChat';
import { IFaceSwap } from './image/img2img/IFaceSwap';
import { Face2Face } from './image/img2img/face2face';
import { IText2Voice } from './audio/text2voice/IText2Voice';
import { IVoice2Voice } from './audio/text2voice/IVoice2Voice';
import { SpeechCraft } from './audio/text2voice/SpeechCraft';
import { MediaFile, AudioFile, ImageFile } from 'media-toolkit';


// SimpleAPI class that supports multiple models
// Register available client types
APIClientFactory.registerClientType('flux-schnell', FluxSchnell);
APIClientFactory.registerClientType('deepseek-r1', DeepSeekR1);
APIClientFactory.registerClientType('face2face', Face2Face);
APIClientFactory.registerClientType('speechcraft', SpeechCraft);

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

  async swapImg2Img(sourceImg: ImageFile | string, targetImg: ImageFile | string, model: string = 'face2face', options?: Record<string, any>): Promise<TrackedJob<ImageFile | any>> {
    const client = APIClientFactory.getClient<IFaceSwap>(model);
    return client.swapImg2Img(sourceImg, targetImg, options);
  }
  
  async text2voice(text: string, model: string = 'speechcraft', options?: Record<string, any>): Promise<TrackedJob<AudioFile | any>> {
    const client = APIClientFactory.getClient<IText2Voice | SpeechCraft>(model);
    return client.text2voice(text, options);
  }
  
  async text2voiceWithEmbedding(text: string, voiceEmbedding: MediaFile | AudioFile | string, model: string = 'speechcraft', options?: Record<string, any>): Promise<TrackedJob<AudioFile | any>> {
    const client = APIClientFactory.getClient<SpeechCraft>(model);
    return client.text2voiceWithEmbedding(text, voiceEmbedding, options);
  }
  
  async voice2embedding(audio: AudioFile | Array<AudioFile> | string | Array<string>, model: string = 'speechcraft', options?: Record<string, any>): Promise<TrackedJob<AudioFile | any>> {
    const client = APIClientFactory.getClient<IVoice2Voice | SpeechCraft>(model);
    return client.voice2embedding(audio, options);
  }
  
  async voice2voice(audio: AudioFile | string, source: AudioFile | string, model: string = 'speechcraft', options?: Record<string, any>): Promise<TrackedJob<AudioFile | any>> {
    const client = APIClientFactory.getClient<IVoice2Voice | SpeechCraft>(model);
    return client.voice2voice(audio, source, options);
  }
  
  getAvailableModels(): string[] {
    return APIClientFactory.getAvailableClients();
  }
}