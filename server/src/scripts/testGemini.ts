import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing Gemini API with key:', apiKey ? 'Key found' : 'KEY MISSING');
  
  if (!apiKey) return process.exit(1);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'API is working'");
    console.log('Success! Gemini response:', result.response.text());
  } catch (error: any) {
    console.error('Gemini Test Failed:', error.message);
  }
};

testGemini();
