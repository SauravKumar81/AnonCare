import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import therapistRoutes from './routes/therapists';
import { setupSocket } from './socket/chat';

const app = express();
const httpServer = createServer(app);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins.length > 0 ? (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allowing everything if FRONTEND_URL is misconfigured, for easier debugging
    }
  } : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

const io = new Server(httpServer, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/therapists', therapistRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('AnonCare API is running...');
});

// Socket.io connection logic
setupSocket(io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anoncare';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Force drop the problematic index if it exists
    try {
      const collection = mongoose.connection.collection('users');
      await collection.dropIndex('email_1');
      console.log('Dropped stale email_1 index');
    } catch (e) {
      // Index might already be gone or doesn't exist
    }

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
