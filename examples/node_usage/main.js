import { socaity, SpeechCraft } from "../../dist/socaity.es.js";

// // Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  
socaity.setApiKey(process.env.SOCAITY_API_KEY);


async function test_img_generation() {
    let images = await socaity.text2img("Rick and Morty swimming in a lake", "flux-schnell", { num_outputs: 1 });
    if (!Array.isArray(images)) {
        images = [images]
    }

    for (let i = 0; i < images.length; i++) {
        await images[i].save(`examples/output/fluxschnell_${i}.jpg`);
    }
}

async function test_chat_model() {
    let result = await socaity.chat("Why is an SDK better than pure API calls? Summarize in three rhyming sentences.");
    console.log(result);
}

async function test_face2face() {
    let result = await socaity.swapImg2Img("examples/data/test_face_4.jpg", "examples/data/test_face_2.jpg");
    await result.save("examples/output/face2face.jpg");
}

async function test_text2voice() {
    let result = await socaity.text2voice("Hello, how are you doing today?");
    await result.save("examples/output/speech.mp3");
}

async function test_voice2voice() {
    const genAI = new SpeechCraft();
    let embedding = await genAI.voice2embedding("examples/data/voice_clone_test_voice_2.wav");
    embedding.save("examples/output/voice_embedding.npz");
    let result = await genAI.voice2voice("examples/data/voice_clone_test_voice_1.wav.mp3", embedding);
    await result.save("examples/output/voice2voice.mp3");
}


//let job1 = test_chat_model();

let job3 = test_img_generation();
//let job4 = test_text2voice();
//let job5 = test_voice2voice();
//let job2 = test_face2face();

//await job2;
await job3;
// await job4;
//await job5;


// Wait for all jobs to finish
//await Promise.all([job1, job2, job3]);
