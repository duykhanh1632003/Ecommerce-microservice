import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { BadRequestError } from './errorHandler';

export const authThenToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const accessToken = Array.isArray(req.headers['authorization'])
      ? req.headers['authorization'][0]
      : req.headers['authorization']?.split(' ')[1];

    const refreshToken = Array.isArray(req.headers['refreshtoken'])
      ? req.headers['refreshtoken'][0]
      : req.headers['refreshtoken']?.split(' ')[1];

    const clientId = Array.isArray(req.headers['x-client-id'])
      ? req.headers['x-client-id'][0]
      : req.headers['x-client-id'] as string;

    const role = Array.isArray(req.headers['role'])
      ? req.headers['role'][0]
      : req.headers['role'] as string;


    if (!accessToken || !refreshToken || !clientId || !role) {
      res.status(401).json({ message: 'Missing authentication headers' });
      return;
    }

    let verificationUrl = '';

    if (role === 'client') {
      verificationUrl = "http://localhost:3001/api/auth/verify-token";
    } else if (role === 'seller') {
      verificationUrl = "http://localhost:3002/api/auth/verify-token";
    } else {
      res.status(401).json({ message: 'Invalid role' });
      return;
    }

    const response = await axios.post(verificationUrl, {
      accessToken,
      refreshToken,
      clientId,
    });

    if (response.status !== 200 || !response.data.isValid) {
      res.status(401).json({ message: 'Token validation failed' });
      return;
    }

    req.user = response.data.user;
    next();
  } catch (error) {
    const errorMessage = `Authentication failed: ${(error as Error).message}`;
    next(new BadRequestError(errorMessage));
  }
};
