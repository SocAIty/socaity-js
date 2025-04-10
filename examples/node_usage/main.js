import { FluxSchnell } from "socaity";
FluxSchnell.text2img("Rick and Morty swimming in a lake", { num_outputs: 1 }).then(images => { 'your logic here'});


import { socaity } from "../../dist/socaity.es.js";
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


//let job1 = test_chat_model();
let job2 = test_face2face();
//let job3 = test_img_generation();

// Wait for all jobs to finish
await Promise.all([job1, job2, job3]);
