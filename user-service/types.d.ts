import { Request } from 'express';
import mongoose from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: mongoose.Types.ObjectId;
      role: string;
    };
  }
}   
