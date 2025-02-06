const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Hello";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error);
    if (error.errorDetails) {
      console.error("Error Details:", error.errorDetails);
    }
  }
}

run();
