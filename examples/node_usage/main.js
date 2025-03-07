import { socaity } from "../../dist/socaity.es.js";

async function test() {
    socaity.setApiKey("affe");
    let img = socaity.text2img("Hello from Node.js", "output.png");
    console.log("hello affe")
    console.log("hello 2")
    const text = await socaity.generateText("Hello from Node.js");
    //console.log(text);
}
test();
