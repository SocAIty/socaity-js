import { socaity } from "../../dist/socaity.es.js";
// // Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  
socaity.setApiKey(process.env.SOCAITY_API_KEY);


async function test_img_generation() {
    let images = await socaity.text2img("Rick and Morty swimming in a lake", "flux-schnell", { num_outputs: 3 });
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


//test_chat_model();
test_img_generation();
