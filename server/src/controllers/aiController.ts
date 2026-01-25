import { Request, Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getAIResponse = async (userMessage: string) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not set or is invalid in .env file');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      return response.text();
    } catch (modelError: any) {
      if (modelError.message?.includes('not found')) {
        console.log('Gemini 1.5 Flash not found, falling back to Gemini Pro...');
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        return response.text();
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const detail = error.message || 'Unknown error';
    return `(Debug: ${detail}) I'm having a little trouble connecting right now, but I'm still here for you. Please share what's on your mind.`;
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  console.log('Gemini Chat Request received:', req.body);
  try {
    const { text } = req.body;
    const userId = req.user?.userId;

    if (!text) {
      console.log('Error: Message text is missing');
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Save user message
    const userMsg = new Message({
      sender: userId,
      text,
      chatType: 'ai'
    });
    await userMsg.save();

    // Get AI response from Gemini
    const aiResponseText = await getAIResponse(text);

    // Note: In a production app, you might want to save the AI response to the database as well
    
    res.status(200).json({
      reply: aiResponseText,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('CRITICAL: AI Chat Controller Error:', error);
    res.status(500).json({ message: 'Error in AI chat', error: (error as any).message });
  }
};
