import { Request, Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/auth';

// Placeholder for AI response logic
// In a real scenario, this would call OpenAI/Gemini API
const getAIResponse = async (userMessage: string) => {
  // Simple empathetic response logic for now
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
    return "I'm sorry to hear that you're feeling this way. It's completely okay to have days like this. Would you like to talk more about what's on your mind?";
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('stress')) {
    return "It sounds like you're going through a lot right now. Take a deep breath. I'm here to listen. What's causing the most stress for you at the moment?";
  }

  return "Thank you for sharing that with me. I'm here to support you in any way I can. How can I best help you today?";
};

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.user?.userId;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Save user message
    const userMsg = new Message({
      sender: userId,
      text,
      chatType: 'ai'
    });
    await userMsg.save();

    // Get AI response
    const aiResponseText = await getAIResponse(text);

    // Save AI response (using a system/ai user or just marking it)
    // For simplicity, we'll just return it for now
    
    res.status(200).json({
      reply: aiResponseText,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in AI chat', error });
  }
};
