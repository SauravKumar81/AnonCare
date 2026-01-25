import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import therapistRoutes from './routes/therapists';
import { setupSocket } from './socket/chat';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/therapists', therapistRoutes);

app.get('/', (req, res) => {
  res.send('AnonCare API is running...');
});

// Socket.io connection logic
setupSocket(io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anoncare';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
