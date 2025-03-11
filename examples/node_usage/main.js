import { socaity } from "../../dist/socaity.es.js";
// // Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  
socaity.setApiKey(process.env.SOCAITY_API_KEY);


async function test() {
    let job_img = socaity.text2img("An elephant swimming in a lake");
    let img = await job_img;
    if (Array.isArray(img)) {
        // save all images
        for (let i = 0; i < img.length; i++) {
            await img[i].save(`elephant_${i}.jpg`);
        }
    }
}


test();
