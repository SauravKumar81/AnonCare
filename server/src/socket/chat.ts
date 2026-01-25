import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import jwt from 'jsonwebtoken';

export const setupSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
      if (err) return next(new Error('Authentication error'));
      (socket as any).user = decoded;
      next();
    });
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.alias} (${socket.id})`);

    socket.on('send_message', async (data: { text: string }) => {
      try {
        const newMessage = new Message({
          sender: user.userId,
          text: data.text,
          chatType: 'anonymous',
          timestamp: new Date()
        });

        await newMessage.save();

        // Broadcast message to everyone for anonymous chat
        io.emit('receive_message', {
          _id: newMessage._id,
          sender: {
            _id: user.userId,
            alias: user.alias
          },
          text: data.text,
          timestamp: newMessage.timestamp
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.alias}`);
    });
  });
};
