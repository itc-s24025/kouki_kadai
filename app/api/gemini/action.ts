// action.ts
"use server"; // 最初に配置

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function postAction(prompt: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
