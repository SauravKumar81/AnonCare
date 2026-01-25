import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  alias: string;
  isTherapist: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  alias: { type: String, required: true, unique: true },
  isTherapist: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
