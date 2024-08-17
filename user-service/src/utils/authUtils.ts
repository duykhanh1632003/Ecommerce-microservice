// src/utils/authUtils.ts
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import mongoose from 'mongoose';
import { Token } from '../models/token.model';

const generateSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const createTokens = async (userId: mongoose.Schema.Types.ObjectId) => {
  const accessSecret = generateSecret();
  const refreshSecret = generateSecret();

  const accessToken = jwt.sign({ id: userId, role: "client" }, accessSecret, { expiresIn: '15d' });
  const refreshToken = jwt.sign({ id: userId, role: "client" }, refreshSecret, { expiresIn: '30d' });

   await Token.create({
    accessToken,
    accessSecret,
    refreshToken,
    refreshSecret,
    userId,
    expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days later
  });

  return {
    accessToken: `Bearer ${accessToken}`,
    refreshToken: `Bearer ${refreshToken}`,
  };
};
