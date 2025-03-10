import { socaity } from "../../dist/socaity.es.js";
// // Load environment variables from the .env file
import dotenv from 'dotenv';
dotenv.config();  
socaity.setApiKey(process.env.SOCAITY_API_KEY);

async function test() {
    let job_img = socaity.text2img("An elephant swimming in a lake");
    console.log(job_img);
    job_img.then((res) => {
        console.log(res);
    });
    //const text = await socaity.generateText("Hello from Node.js");
    await job_img;
    
    //console.log(text);
}
test();
