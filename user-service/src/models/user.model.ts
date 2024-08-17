// src/models/user.model.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IBank, IAddress } from '../interfaces/user.interface';
import toIdPlugin from './plugin/toIdPlugin';

const BankSchema = new Schema<IBank>({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountHolderName: { type: String, required: true },
}, { _id: false });

const AddressSchema = new Schema<IAddress>({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { _id: false });

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  primaryPhoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  banks: [BankSchema],
  addresses: [AddressSchema],
  avatar: { type: String },
}, { timestamps: true });

UserSchema.plugin(toIdPlugin);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Compare the password for login
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
