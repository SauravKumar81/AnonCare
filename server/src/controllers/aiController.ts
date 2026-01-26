import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/auth';


const getAIResponse = async (userMessage: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set or is invalid');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    console.log('Fetching AI response for:', userMessage);
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    console.log('AI Response successful:', text.substring(0, 50) + '...');
    return text;
  } catch (modelError: any) {
    console.error('Gemini API Error:', {
      status: modelError.status,
      message: modelError.message,
      stack: modelError.stack
    });
    throw modelError;
  }
};

export const generateTherapistPersona = async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;
    const userId = req.user?.userId;
    if (!description) return res.status(400).json({ message: 'Description is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a professional therapist persona instruction based on: "${description}". Return only the persona starting with "You are...".`;
    
    const result = await model.generateContent(prompt);
    const persona = result.response.text();

    await User.findByIdAndUpdate(userId, { customAgentPersona: persona });
    res.status(200).json({ persona, message: 'Custom agent created!' });
  } catch (error) {
    console.error('Persona error:', error);
    res.status(503).json({ message: 'AI service is currently under maintenance' });
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.user?.userId;
    console.log('Received chat request from user:', userId, 'Text:', text);

    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const userMsg = new Message({ sender: userId, text, chatType: 'ai' });
    await userMsg.save();

    const aiResponseText = await getAIResponse(text);
    
    if (!aiResponseText) {
      console.error('AI Error: Gemini returned empty response');
      return res.status(500).json({ message: 'AI returned an empty response. Please try again.' });
    }
    
    res.status(200).json({ reply: aiResponseText, timestamp: new Date() });
  } catch (error: any) {
    console.error('AI Chat Error (Outer):', error.message || error);
    res.status(500).json({ 
      message: 'AI Service Error', 
      error: error.message || 'Unknown error' 
    });
  }
};
