import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import toIdPlugin from './plugin/toIdPlugin';
import { IAddress, IBank, IUser } from '../interfaces/user.interface';


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
  isEmailVerified: { type: Boolean, default: false },  // Thêm thông tin về trạng thái kích hoạt email
  primaryPhoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: null },
  dateOfBirth: { type: Date, default: null },
  password: { type: String, required: true },
  idCardNumber: { type: String, required: true },  // Thêm căn cước chứng minh nhân dân
  idCardIssuedDate: { type: Date, required: true },  // Ngày cấp căn cước chứng minh nhân dân
  idCardIssuedPlace: { type: String, required: true },  // Nơi cấp căn cước chứng minh nhân dân
  bank: { type: BankSchema, required: true },  // Một seller có một thông tin ngân hàng
  address: { type: AddressSchema, required: true },  // Một seller có một địa chỉ
  avatar: { type: String, default: null },
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
