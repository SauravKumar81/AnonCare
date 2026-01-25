import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  client: mongoose.Types.ObjectId;
  therapist: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  sessionLink?: string; // For WebRTC/Zoom/etc.
}

const AppointmentSchema: Schema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  therapist: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  sessionLink: { type: String }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
