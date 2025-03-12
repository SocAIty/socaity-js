import { socaity } from "../../dist/socaity.es.js";
// // Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  
socaity.setApiKey(process.env.SOCAITY_API_KEY);


async function test_img_generation() {
    let job_img = socaity.text2img("Rick and Morty swimming in a lake");

    let img = await job_img;
    if (Array.isArray(img)) {
        // save all images
        for (let i = 0; i < img.length; i++) {
            await img[i].save(`elephant_${i}.jpg`);
        }
    }
}

async function test_chat_model() {
    let result = await socaity.chat("Why is an SDK better than pure API calls? Summarize in three rhyming sentences.");
    console.log(result);
}


test_chat_model();
//test_img_generation();
