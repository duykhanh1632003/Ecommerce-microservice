import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Token } from './models/token.model';
dotenv.config();
const app = express();
app.use(express.json());

app.post('/token', async (req: Request, res: Response) => {
  const refreshToken = req.headers['refreshtoken'] as string;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
  }

  const storedToken = await Token.findOne({ refreshToken });
  if (!storedToken) {
    return res.status(403).json({ message: 'Forbidden: Refresh token not found' });
  }

  // Check if refreshToken has expired or been revoked
  if (storedToken.isExpiredOrRevoked()) {
    await storedToken.deleteOne();
    return res.status(403).json({ message: 'Forbidden: Refresh token has expired or been revoked. Please log in again.' });
  }

  // Extend the refreshToken if the remaining time is less than 15 days
  const timeRemaining = storedToken.expiresAt.getTime() - Date.now();
  const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

  if (daysRemaining < 15) {
    storedToken.extendExpiry(30); // Extend expiry back to 30 days
    await storedToken.save();
  }

  // Decode refreshToken using the refreshSecret from the DB
  jwt.verify(refreshToken, storedToken.refreshSecret, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }

    // Create a new accessToken
    const newAccessToken = jwt.sign({ _id: user.id }, storedToken.accessSecret, { expiresIn: '15m' });

    // Update accessToken and lastUsedAt
    storedToken.accessToken = newAccessToken;
    storedToken.lastUsedAt = new Date();
    await storedToken.save();

    // Return the accessToken with the "Bearer" prefix
    res.json({ accessToken: `Bearer ${newAccessToken}` });
  });
});

// Revoke a refresh token
app.post('/revoke', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const storedToken = await Token.findOne({ refreshToken });

  if (!storedToken) {
    return res.status(403).json({ message: 'Forbidden: Refresh token not found' });
  }

  storedToken.revoked = true;
  await storedToken.save();

  res.json({ message: 'Token has been revoked.' });
});

export default app;
