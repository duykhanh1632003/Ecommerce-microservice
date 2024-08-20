import { Document } from "mongoose";

// Interface định nghĩa các thông tin cần thiết cho seller
export interface IBank {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  verificationToken?: string
  primaryPhoneNumber: string;
  gender: 'Male' | 'Female' | 'Other' | null;
  dateOfBirth: Date | null;
  password: string;
  idCardNumber: string;
  idCardIssuedDate: Date;
  idCardIssuedPlace: string;
  bank: IBank;
  address: IAddress;
  avatar?: string;
  comparePassword: (password: string) => Promise<boolean>;
}
