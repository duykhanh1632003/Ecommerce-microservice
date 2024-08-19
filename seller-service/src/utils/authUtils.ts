import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Types } from 'mongoose';
import { Token } from '../models/token.model';
import { BadRequestError } from './errorHandler';

// Custom request interface is now globally extended

const generateSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const createTokens = async (userId: Types.ObjectId) => {
  const accessSecret = generateSecret();
  const refreshSecret = generateSecret();

  const accessToken = jwt.sign({ id: userId, role: "seller" }, accessSecret, { expiresIn: '15d' });
  const refreshToken = jwt.sign({ id: userId, role: "seller" }, refreshSecret, { expiresIn: '30d' });

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

export const authThenToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = Array.isArray(req.headers['authorization'])
      ? req.headers['authorization'][0]
      : req.headers['authorization']?.split(' ')[1];
    const refreshToken = Array.isArray(req.headers['refreshtoken'])
      ? req.headers['refreshtoken'][0]
      : req.headers['refreshtoken']?.split(' ')[1];

    const clientId = req.headers['x-client-id'] as string;

    if (!accessToken || !refreshToken || !clientId) {
      res.status(401).json({ message: 'Missing authentication headers' });
      return;
    }

    const tokenDocument = await Token.findOne({ accessToken }).populate('userId');
    if (!tokenDocument || tokenDocument.isExpiredOrRevoked()) {
      res.status(401).json({ message: 'Access Token is invalid or expired' });
      return;
    }

    const decoded = jwt.verify(accessToken, tokenDocument.accessSecret) as { id: string; role: string };
    req.user = { id: new Types.ObjectId(decoded.id), role: decoded.role };

    next();
  } catch (error) {
    const errorMessage = `Authentication failed: ${(error as Error).message}`;
    next(new BadRequestError(errorMessage));
  }
};
