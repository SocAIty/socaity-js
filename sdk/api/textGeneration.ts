import axios from "axios";

export async function generateText(prompt: string): Promise<string> {
  const response = await axios.post("https://api.socaity.ai/generate", { prompt });
  return response.data.text;
}
