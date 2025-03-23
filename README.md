<h1 align="center" style="margin-top:-25px">SocAIty SDK</h1>
<p align="center">
  <img align="center" src="docs/socaity_icon.png" height="200" />
</p>
<h2 align="center" style="margin-top:-10px">Build AI-powered applications with ease </h2>

## Introduction

The **Socaity TypeScript SDK** simplifies integration with **[Socaity.ai](https://www.socaity.ai)**, a leading platform for AI-powered content generation, including **text-to-image**, **text-to-speech**, **face swapping**, **chat models**, and more.

With a lightweight footprint (**UMD ~25KB, ES ~30KB**), this SDK lets you seamlessly interact with Socaity's hosted AI models using simple, intuitive API calls.

A complete list of all models can be found [here](https://www.socaity.ai/APIs/Overview).

## 🚀 Why Use the Socaity SDK?
- **One-liner AI calls** – No need to handle raw API requests.
- **Asynchronous & performant** – Optimized for parallel processing.
- **Supports multiple AI models** – Text, images, voice cloning, deep fakes, virutal avatars and more.
- **File handling included** – Upload/download images with ease.
- **Works with Node.js & Browser** – Supports ES modules and UMD builds.

## Installation

Install via **npm**:
```sh
npm install socaity
```

## Quick Start

### 🔑 Import the SDK
```typescript
import { socaity } from "socaity";
socaity.setApiKey('sk...'); // we recommend settting the API key with environment variables. 
```
Register and [get your API key](https://www.socaity.ai/signinup?page_state=0)

### 💬 AI Chat with SOTA LLMs Models

This will use the SOTA DeepSeek-R1 to create your response.
```typescript
const response = await socaity.chat("Explain why an SDK is better than direct API calls.");
```
To use a different model like llama3 just add a second parameter as model name.

### 🖼️ Generate an AI Image

```typescript
const images = await socaity.text2img("A futuristic city at sunset", "flux-schnell", { num_outputs: 1 });
await images[0].save("output/futuristic_city.jpg");
```


### 🗣️ Text-To-Speech

```typescript
const audio = await socaity.text2voice("Hello, welcome to Socaity!");
await audio.save("output/welcome_message.mp3");
```

### 🎤 Voice-Cloning

Use two audio-files and copy the voice of the source to the other one.
Internally this will create an embedding first.

```typescript
const clonedVoice = await socaity.voice2voice("data/input_voice.mp3", "data/source_voice.mp3");
await clonedVoice.save("output/cloned_voice.mp3");
```

Or do it more efficient by creating and reusing an embedding by leveraging the power of [SpeechCraft](https://github.com/SocAIty/SpeechCraft).

```typescript
import { SpeechCraft } from 'socaity'

// create embedding
const speechCraft = new SpeechCraft();
const embedding = await speechCraft.voice2embedding("data/source_voice.mp3");
await embedding.save("output/source_embedding.npz");

// reuse embedding
const clonedVoice = await speechCraft.voice2voice("data/input_voice.mp3", "output/source_embedding.npz");
await clonedVoice.save("output/cloned_voice.mp3");
```

### 🖼️ Face Swapping and DeepFakes
```typescript
const result = await socaity.swapImg2Img("data/source.jpg", "data/target.jpg");
await result.save("output/face_swap.jpg");
```

## Advanced Usage


### Running Multiple Requests in Parallel
```typescript
const [img, chat_response] = await Promise.all([
  socaity.text2img("A cyberpunk landscape", "flux-schnell"),
  socaity.chat("Describe quantum physics in simple terms.")
]);
```

### Working with files (media-toolkit)

The SocAIty SDK includes a powerful toolkit that simplifies handling files across both Node.js and browser environments. Check-out the media-toolkit [docs](https://github.com/SocAIty/media-toolkit-js) to learn more about it. 

### Working directly with your favorite models.

Many models are directly importable by the module. Some of them have specialized methods and parameters which are not included to the simple usage wrapper methods like socaity.text2img. 


```typescript
import { FluxSchnell } from "socaity";
FluxSchnell.text2img("Rick and Morty swimming in a lake", { 
    num_outputs: 3,   
    aspect_ratio: "16:9",
    num_outputs: 3,
    num_inference_steps: 5}
).then(images => { ... });
```


## Browser & Node.js Support
- **Node.js:** Works with `import { socaity } from "socaity"`.
- **Browser:** Use the UMD build: `<script src="socaity.umd.js"></script>`.

You might be interested also in the [python SDK](https://github.com/SocAIty/socaity)

## Contributing
We welcome contributions! Submit PRs or report issues in the GitHub Repos or in the Help section of your socaity account.

## License
This SDK is open-source and available under the **MIT License**.

### 🌟 Star this repo if you find it useful!

Note: We are in alpha version. Thus expect rapid changes to the SDK, APIs and more models to be added frequently.
