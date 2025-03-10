import { Configuration } from '../configuration';
import { FluxSchnell } from './image/text2image/FluxSchnell';
import { TrackedJob } from '../core/job/TrackedJob';
import { SocaityConfig } from '../types';
import { BaseText2Image } from './image/text2image/BaseText2Image';

// SimpleAPI class that supports multiple models
export class SimpleAPI {
  private models: Record<string, BaseText2Image>;
  private config: Configuration;

  constructor(configOptions: Partial<SocaityConfig> = {}) {
    // Global configuration
    this.config = Configuration.getInstance();
    Configuration.update(configOptions);

    // Register supported models dynamically
    this.models = {
      fluxschnell: new FluxSchnell(),
      // Future models can be added here
    };
  }

  /** Get model from registry. Method is case insensitive */
  getModel(model: string) {
    model = model.toLowerCase().replace(/[^a-z0-9]/g, "");
    const selectedModel = Object.keys(this.models).find((key) => key.toLowerCase().replace(/[^a-z0-9]/g, "") === model);
    if (!selectedModel) {
      throw new Error(`Model "${model}" not found. Available models: ${Object.keys(this.models).join(", ")}`);
    }
    return this.models[selectedModel];
  }

  /**
   * Generate an image from text using a specified model.
   * Defaults to "fluxSchnell" if no model is provided.
   */
  text2img(prompt: string, model: string = "flux-schnell", options?: Record<string, any>): Promise<TrackedJob<any>> {
    const selectedModel = this.getModel(model);
    return selectedModel.text2img(prompt, options);
  }
}