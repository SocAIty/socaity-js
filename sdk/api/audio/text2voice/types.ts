import { z } from 'zod';
import { MediaFile, AudioFile } from 'media-toolkit';

export const allowedAudioTypes = z.union([
  z.string(),
  z.null(),
  z.instanceof(Blob),
  z.instanceof(File),
  z.instanceof(MediaFile),
  z.instanceof(AudioFile),
  // Add Buffer type for Node.js environment
  // z.instanceof(Buffer)
]).default(null);

// Define the parameter schemas for text2voice endpoint
export const zText2VoiceParams = z.object({
  text: z.string().default('Hey there, you did not provide an input text!'),
  voice: z.string().optional().default("hermine"),
  semantic_temp: z.number().optional().default(0.7),
  semantic_top_k: z.number().optional().default(50),
  semantic_top_p: z.number().optional().default(0.95),
  coarse_temp: z.number().optional().default(0.7),
  coarse_top_k: z.number().optional().default(50),
  coarse_top_p: z.number().optional().default(0.95),
  fine_temp: z.number().optional().default(0.7)
});

// Define the parameter schemas for text2voice_with_embedding endpoint
export const zText2VoiceWithEmbeddingParams = z.object({
  text: z.string().default('Hey there, you did not provide an input text!'),
  semantic_temp: z.number().optional().default(0.7),
  semantic_top_k: z.number().optional().default(50),
  semantic_top_p: z.number().optional().default(0.95),
  coarse_temp: z.number().optional().default(0.7),
  coarse_top_k: z.number().optional().default(50),
  coarse_top_p: z.number().optional().default(0.95),
  fine_temp: z.number().optional().default(0.7)
});

export const zText2VoiceWithEmbeddingFileParams = z.object({
  voice: allowedAudioTypes
});

// Define the parameter schemas for voice2embedding endpoint
export const zVoice2EmbeddingParams = z.object({
  voice_name: z.string().optional(),
  save: z.boolean().optional().default(false)
});

export const zVoice2EmbeddingFileParams = z.object({
  audio_file: allowedAudioTypes
});

// Define the parameter schemas for voice2voice endpoint
export const zVoice2VoiceParams = z.object({
  voice_name: z.string().optional(),
  temp: z.number().optional().default(0.7)
});

export const zVoice2VoiceFileParams = z.object({
  audio_file: allowedAudioTypes
});

// Export the types based on the Zod schemas
export type Text2VoiceParams = z.infer<typeof zText2VoiceParams>;
export type Text2VoiceWithEmbeddingParams = z.infer<typeof zText2VoiceWithEmbeddingParams>;
export type Text2VoiceWithEmbeddingFileParams = z.infer<typeof zText2VoiceWithEmbeddingFileParams>;
export type Voice2EmbeddingParams = z.infer<typeof zVoice2EmbeddingParams>;
export type Voice2EmbeddingFileParams = z.infer<typeof zVoice2EmbeddingFileParams>;
export type Voice2VoiceParams = z.infer<typeof zVoice2VoiceParams>;
export type Voice2VoiceFileParams = z.infer<typeof zVoice2VoiceFileParams>;