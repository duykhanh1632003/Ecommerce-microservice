import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import toIdPlugin from '../utils/toIdPlugin';

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  primaryPhoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date;
  password: string;
  banks: Array<typeof BankSchema>;
  addresses: Array<typeof AddressSchema>;
  avatar: string;
  comparePassword(password: string): Promise<boolean>;
}

const BankSchema = new Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountHolderName: { type: String, required: true },
}, { _id: false });

const AddressSchema = new Schema({
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
