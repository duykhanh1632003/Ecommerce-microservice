import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto'; // Import crypto using named import
import mongoose from 'mongoose';
import { Token } from 'src/models/token.model';

const generateSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

const createTokens = async (userId: mongoose.Schema.Types.ObjectId) => {
  const accessSecret = generateSecret();
  const refreshSecret = generateSecret();

  const accessToken = jwt.sign({ id: userId }, accessSecret, { expiresIn: '15d' });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: '30d' });

  const tokenDocument = await Token.create({
    accessToken,
    accessSecret,
    refreshToken,
    refreshSecret,
    userId,
    expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days later
  });

  await tokenDocument.save();

  return { accessToken: `Bearer ${accessToken}`,
    refreshToken: `Bearer ${refreshToken}`,
 };
};

export default createTokens;
