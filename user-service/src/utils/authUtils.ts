import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import  { Types } from 'mongoose';
import { Token } from '../models/token.model';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from './errorHandler';

const generateSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const createTokens = async (userId: Types.ObjectId) => {
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

export const authThenToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['refreshToken'] as string;
    const clientId = req.headers['x-client-id'] as string;

    if (!accessToken || !refreshToken || !clientId) {
      return res.status(401).json({ message: 'Missing authentication headers' });
    }
    
    const tokenDocument = await Token.findOne({ accessToken }).populate('userId');
    if (!tokenDocument || tokenDocument.isExpiredOrRevoked()) {
      return res.status(401).json({ message: 'Access Token is invalid or expired' });
    }

    const decoded = jwt.verify(accessToken, tokenDocument.accessSecret) as { id: string; role: string };
    req.user = { id: new Types.ObjectId(decoded.id), role: decoded.role }; // Ensure the correct type

    next();
  } catch (error) {
    const errorMessage = `Authentication failed: ${(error as Error).message}`;
    throw new BadRequestError(errorMessage);
  }
};
