import { IText2Voice } from './IText2Voice';
import { IVoice2Voice } from './IVoice2Voice';
import { ApiClient } from '../../../core/web/APIClient';
import { TrackedJob } from '../../../core/job/TrackedJob';
import { MediaFile, AudioFile } from 'media-toolkit';
import { z } from 'zod';

import {
  zText2VoiceParams,
  zText2VoiceWithEmbeddingParams,
  zText2VoiceWithEmbeddingFileParams,
  zVoice2EmbeddingParams,
  zVoice2EmbeddingFileParams,
  zVoice2VoiceParams,
  zVoice2VoiceFileParams
} from './types';

/**
 * Client for the SpeechCraft text-to-speech and voice-to-voice service
 */
export class SpeechCraft extends ApiClient implements IText2Voice, IVoice2Voice {
  constructor() {
    super('speechcraft');
  }

  /**
   * Register SpeechCraft specific endpoints
   */
  protected registerEndpoints(): void {
    this.registerEndpoint({
      path: 'text2voice',
      method: 'POST',
      queryParams: zText2VoiceParams.parse({}),
      fileParams: z.object({}).parse({}),
    });

    this.registerEndpoint({
      path: 'text2voice_with_embedding',
      method: 'POST',
      queryParams: zText2VoiceWithEmbeddingParams.parse({}),
      fileParams: zText2VoiceWithEmbeddingFileParams.parse({}),
    });

    this.registerEndpoint({
      path: 'voice2embedding',
      method: 'POST',
      queryParams: zVoice2EmbeddingParams.parse({}),
      fileParams: zVoice2EmbeddingFileParams.parse({}),
    });

    this.registerEndpoint({
      path: 'voice2voice',
      method: 'POST',
      queryParams: zVoice2VoiceParams.parse({}),
      fileParams: zVoice2VoiceFileParams.parse({}),
    });
  }

  async parseResult(full_output: any): Promise<AudioFile | Array<AudioFile> | any> {
    if (Array.isArray(full_output)) {
      return Promise.all(full_output.map((file) => new AudioFile().fromAny(file)));
    }
    return await new AudioFile().fromAny(full_output);
  }

  /**
   * Generate realistic sounding voice from a written text.
   * @param text - Text to convert to speech
   * @param options - Additional options like voice, temperature settings, etc.
   * @returns TrackedJob that resolves to the generated audio
   */
  async text2voice(
    text: string,
    options?: Partial<z.infer<typeof zText2VoiceParams>>
  ): Promise<TrackedJob<AudioFile>> {
    const endpoint = this.getEndpoint('text2voice');

    const params = zText2VoiceParams.parse({
      text,
      ...options
    });

    return this.submitTrackedJob(endpoint, params, this.parseResult);
  }

  /**
   * Generate realistic sounding voice from text using a custom voice embedding.
   * @param text - Text to convert to speech
   * @param voiceEmbedding - Voice embedding .npz file to use for voice generation
   * @param options - Additional options like temperature settings
   * @returns TrackedJob that resolves to the generated audio
   */
  async text2voiceWithEmbedding(
    text: string,
    voiceEmbedding: MediaFile | AudioFile | string,
    options?: Partial<z.infer<typeof zText2VoiceWithEmbeddingParams>>
  ): Promise<TrackedJob<AudioFile>> {
    const endpoint = this.getEndpoint('text2voice_with_embedding');

    const voiceFile = await MediaFile.create(voiceEmbedding);
    if (!voiceFile) {
      throw new Error('Invalid voice embedding file');
    }

    const queryParams = zText2VoiceWithEmbeddingParams.parse({
      text,
      ...options
    });
    
    const fileParams = zText2VoiceWithEmbeddingFileParams.parse({
      voice: voiceFile
    });

    const params = { ...queryParams, ...fileParams };
    return this.submitTrackedJob(endpoint, params, this.parseResult);
  }

  /**
   * Generate voice embedding from an audio file.
   * @param audio - Audio file containing the voice to embed
   * @param options - Additional options like voice_name and save flag
   * @returns TrackedJob that resolves to the generated embedding
   */
  async voice2embedding(
    audio: MediaFile | AudioFile | string | Array<MediaFile | AudioFile | string>,
    options?: Partial<z.infer<typeof zVoice2EmbeddingParams>>
  ): Promise<TrackedJob<AudioFile>> {
    const endpoint = this.getEndpoint('voice2embedding');

    let audioFile: MediaFile | AudioFile;
    
    // Handle single audio file or first item in array
    if (Array.isArray(audio)) {
      if (audio.length === 0) {
        throw new Error('Empty audio array provided');
      }
      audioFile = await AudioFile.create(audio[0]);
    } else {
      audioFile = await AudioFile.create(audio);
    }

    if (!audioFile) {
      throw new Error('Invalid audio file');
    }

    const queryParams = zVoice2EmbeddingParams.parse(options || {});
    const fileParams = zVoice2EmbeddingFileParams.parse({ audio_file: audioFile });
    
    const params = { ...queryParams, ...fileParams };
    return this.submitTrackedJob(endpoint, params, this.parseResult);
  }

  /**
   * Clone a voice in an audio file using a source voice.
   * @param audio - Audio file to convert
   * @param source - Source voice (embedding, name, or audio file)
   * @param options - Additional options
   * @returns TrackedJob that resolves to the converted audio
   */
  async voice2voice(
    audio: AudioFile | Array<AudioFile> | string | Array<string>,
    source?: MediaFile | AudioFile | string,
    options?: Partial<z.infer<typeof zVoice2VoiceParams>>
  ): Promise<TrackedJob<AudioFile>> {
    const endpoint = this.getEndpoint('voice2voice');

    const audioFile = await AudioFile.create(audio);
    if (!audioFile) {
      throw new Error('Invalid audio file');
    }

    let queryParams: Partial<z.infer<typeof zVoice2VoiceParams>> = { ...options };
    
    // If source is provided as MediaFile or AudioFile or file path/URL, 
    // convert it to an embedding first
    if (source) {
      if (typeof source !== typeof MediaFile && typeof source === 'string' && !source.includes('/') && !source.includes('\\')) {
        // Assume it's a voice name
        queryParams.voice_name = source;
      } 
      else {
        // Otherwise, we need to get the embedding first
        const sourceEmbedding = await this.voice2embedding(source);
        source = sourceEmbedding;
      }
    }
    
    const parsedQueryParams = zVoice2VoiceParams.parse(queryParams);
    const fileParams = zVoice2VoiceFileParams.parse({ audio_file: audioFile });
    
    const params = { ...parsedQueryParams, ...fileParams };
    return this.submitTrackedJob(endpoint, params, this.parseResult);
  }
}