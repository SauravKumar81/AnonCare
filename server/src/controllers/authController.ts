import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateAlias = () => {
  const adjectives = ['Quiet', 'Brave', 'Calm', 'Kind', 'Wise', 'Soft', 'Strong'];
  const nouns = ['Panda', 'Eagle', 'River', 'Star', 'Leaf', 'Mountain', 'Cloud'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
};

export const anonymousLogin = async (req: Request, res: Response) => {
  try {
    let alias = generateAlias();
    
    // Check if alias exists (extremely unlikely but possible)
    let existingUser = await User.findOne({ alias });
    while (existingUser) {
      alias = generateAlias();
      existingUser = await User.findOne({ alias });
    }

    const newUser = new User({ alias });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, alias: newUser.alias },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        alias: newUser.alias
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during anonymous login', error });
  }
};
