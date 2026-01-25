import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver?: mongoose.Types.ObjectId; // Optional for public or AI chat
  text: string;
  chatType: 'anonymous' | 'therapist' | 'ai';
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  chatType: { 
    type: String, 
    enum: ['anonymous', 'therapist', 'ai'], 
    default: 'anonymous' 
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
