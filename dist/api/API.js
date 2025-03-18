import { Configuration } from '../core/configuration';
import { FluxSchnell } from './image/text2img/FluxSchnell';
import { DeepSeekR1 } from './text/chat/deepseekr1';
import { APIClientFactory } from '../core/web/APIClientFactory';
import { Face2Face } from './image/img2img/face2face';
// SimpleAPI class that supports multiple models
// Register available client types
APIClientFactory.registerClientType('flux-schnell', FluxSchnell);
APIClientFactory.registerClientType('deepseek-r1', DeepSeekR1);
APIClientFactory.registerClientType('face2face', Face2Face);
// API.ts - Simplified API interface
export class SocaityAPI {
    constructor(configOptions = {}) {
        Configuration.update(configOptions);
    }
    async text2img(prompt, model = 'flux-schnell', options) {
        const client = APIClientFactory.getClient(model);
        return client.text2img(prompt, options);
    }
    async chat(prompt, model = 'deepseek-r1', options) {
        const client = APIClientFactory.getClient(model);
        return client.chat(prompt, options);
    }
    async swapImg2Img(sourceImg, targetImg, model = 'face2face', options) {
        const client = APIClientFactory.getClient(model);
        return client.swapImg2Img(sourceImg, targetImg, options);
    }
    getAvailableModels() {
        return APIClientFactory.getAvailableClients();
    }
}
//# sourceMappingURL=API.js.map