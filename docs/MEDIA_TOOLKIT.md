## Working with Files

The SocAIty SDK includes a powerful `MediaFile` toolkit that simplifies handling files across both Node.js and browser environments. This section covers how to effectively work with files when using the SDK.

### Loading Files

The SDK supports loading files from various sources:

```typescript
// From a local file path (Node.js only)
const imageFile = await socaity.MediaFile.create("./path/to/image.jpg");

// From a URL
const imageFromUrl = await socaity.MediaFile.create("https://example.com/image.jpg");

// From base64 data
const imageFromBase64 = await socaity.MediaFile.create("data:image/jpeg;base64,/9j/4AAQ...");

// From binary data (ArrayBuffer, Buffer, or Uint8Array)
const buffer = fs.readFileSync("./image.jpg");
const imageFromBuffer = await socaity.MediaFile.create(buffer);
```

### Sending Files to Socaity APIs

Once you have a `MediaFile` object, you can use it directly with any Socaity API endpoint:

```typescript
// Load an image
const sourceImage = await socaity.MediaFile.create("./person.jpg");
const targetImage = await socaity.MediaFile.create("./target.jpg");

// Use with face swap API
const swappedFace = await socaity.swapImg2Img(sourceImage, targetImage);

// Use with text-to-image API for image-to-image processing
const prompt = "Transform this into a cyberpunk scene";
const enhancedImage = await socaity.text2img(prompt, "flux-schnell", {
  init_image: sourceImage,
  strength: 0.75
});
```

### Saving and Exporting Files

After receiving results from Socaity APIs, you can easily save or export them:

```typescript
// Save to disk (Node.js) or download (browser)
await result.save("output/generated_image.jpg");

// Convert to different formats
const base64String = result.toBase64(); // Returns data URI by default
const arrayBuffer = result.toArrayBuffer();
const uint8Array = result.toUint8Array();

// In Node.js environments
const buffer = result.toBuffer();

// In browser environments
const blob = result.toBlob();
```

### Embedding Media in Websites

For web applications, you can easily embed generated content:

```typescript
// Generate an image with Socaity API
const generatedImage = await socaity.text2img("A futuristic city", "flux-schnell");

// Convert to base64 for embedding in HTML
const base64Data = generatedImage[0].toBase64();

// Use in an HTML img tag
const imgElement = document.createElement('img');
imgElement.src = base64Data;
document.getElementById('gallery').appendChild(imgElement);

// Alternative direct usage with React
function ImageComponent({ imageData }) {
  return <img src={imageData.toBase64()} alt="Generated image" />;
}
```

### File Information and Manipulation

Retrieve and modify file metadata:

```typescript
// Get file information
const fileInfo = mediaFile.getInfo();
console.log(`Filename: ${fileInfo.fileName}`);
console.log(`Content type: ${fileInfo.contentType}`);
console.log(`Size: ${fileInfo.size} bytes`);
console.log(`Extension: ${fileInfo.extension}`);

// Check file size in different units
const sizeInKB = mediaFile.fileSize('kb');
const sizeInMB = mediaFile.fileSize('mb');

// Modify file metadata
mediaFile.setFileName("renamed_file.png");
mediaFile.setContentType("image/png");
```

### Advanced Usage: File Processing Pipeline

Create efficient processing pipelines by chaining operations:

```typescript
// Example: Process multiple files in parallel
async function processUserAvatars(userIds) {
  const baseImage = await socaity.MediaFile.create("./template.jpg");
  
  return await Promise.all(userIds.map(async (userId) => {
    // Generate personalized avatar
    const avatar = await socaity.text2img(`Avatar for user ${userId}`, "flux-portrait", {
      init_image: baseImage,
      strength: 0.6
    });
    
    // Save to user directory
    await avatar[0].save(`users/${userId}/avatar.jpg`);
    
    return avatar[0];
  }));
}
```
