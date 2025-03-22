import { TrackedJob } from '../../../core/job/TrackedJob';
import { IAPIClient } from '../../../core/web/APIClient';
import { MediaFile, AudioFile } from '@socaity/media-toolkit'

/**
 * Base interface for voice-to-voice models
 */
export interface IVoice2Voice extends IAPIClient {
  /**
   * Generate an realistic sounding voice from a written text.
   * @param audio - an audio file, an array of audio files or an array of audio file Paths/URLs
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated embedding.
    */
  voice2embedding(audio: AudioFile | Array<AudioFile> | string | Array<string>, options?: Record<string, any>): Promise<TrackedJob<MediaFile | any>>;
    /**
   * Generate an realistic sounding voice from a written text.
   * @param audio - the voice in the file gets converted to to the source voice
   * @param targetVoice - the embedding, voice name or audio file to convert the audio from.
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the cloned voice.
    */
  voice2voice(audio: AudioFile | Array<AudioFile> | string | Array<string>, targetVoice?: AudioFile | string, options?: Record<string, any>): Promise<TrackedJob<AudioFile | any>>;
}

