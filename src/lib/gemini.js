import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateText(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const generationConfig = {
    temperature: 0.9,
    maxOutputTokens: 256,
  };
  const result = await model.generateContent(prompt, generationConfig);
  return result.response.text();
}
