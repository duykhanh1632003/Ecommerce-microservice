// src/interfaces/user.interface.ts
import { Request } from 'express';
import mongoose, { Document, ObjectId } from 'mongoose';

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
  primaryPhoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date;
  password: string;
  banks: Array<IBank>;
  addresses: Array<IAddress>;
  avatar: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface User {
  id: ObjectId;
}

