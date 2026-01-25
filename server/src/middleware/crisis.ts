import { Request, Response, NextFunction } from 'express';

const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'hurt myself', 'end my life', 
  'don\'t want to live', 'self harm', 'cutting myself'
];

export const crisisAlertMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  if (text) {
    const foundKeyword = CRISIS_KEYWORDS.find(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (foundKeyword) {
      // In a real app, this would trigger an email/SMS alert to admins 
      // and return a specific flag to the frontend
      (req as any).crisisDetected = true;
    }
  }
  
  next();
};
