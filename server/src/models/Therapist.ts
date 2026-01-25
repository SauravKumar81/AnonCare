import mongoose, { Schema, Document } from 'mongoose';

export interface ITherapist extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  specialization: string[];
  bio: string;
  isVerified: boolean;
  hourlyRate: number;
  availability: {
    day: string; // e.g., 'Monday'
    slots: string[]; // e.g., ['10:00', '11:00']
  }[];
}

const TherapistSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  specialization: [{ type: String }],
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  hourlyRate: { type: Number, default: 0 },
  availability: [{
    day: { type: String },
    slots: [{ type: String }]
  }]
});

export default mongoose.model<ITherapist>('Therapist', TherapistSchema);
