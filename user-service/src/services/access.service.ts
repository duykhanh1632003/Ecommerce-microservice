import { createTokens } from '../utils/authUtils';
import { BadRequestError, ValidationError } from '../utils/errorHandler';
import { Token } from '../models/token.model';
import { User } from '../models/user.model';
import { registerValidation, loginValidation } from '../validations/validation'; // Ensure these are correctly imported
import { IUser } from '../interfaces/user.interface';
import Joi from 'joi';
import { Types } from 'mongoose';

export class AccessService {
  async createUser(userData : IUser): Promise<any> {
    // Validate user data
    const { error } = registerValidation.validate(userData);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }
    const existingUserName = await User.findOne({ username: userData.username });
    if (existingUserName) {
      throw new BadRequestError('Username already exists');
    }
    // Create and save the user
    const user = await User.create(userData);

    // Generate tokens
    const tokens  = createTokens(user.id);
    return {
      tokens,
      user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          primaryPhoneNumber: user.primaryPhoneNumber,
      },
    }
  }

async loginUser(email: string, password: string): Promise<any> {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ValidationError('Invalid email or password');
  }

  // Convert user.id from Schema.Types.ObjectId to Types.ObjectId
  const tokens = await createTokens(user.id.toString());
  return {
    tokens,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      primaryPhoneNumber: user.primaryPhoneNumber,
    },
  };
}

  async refreshAccessToken(refreshToken: string): Promise<any> {
    // Validate the token
    const { error } = Joi.string().required().validate(refreshToken);
    if (error) {  
      throw new ValidationError(error.details[0].message);
    }

    // Find the token document
    const tokenDocument = await Token.findOne({ refreshToken });
    if (!tokenDocument) {
      throw new ValidationError('Invalid refresh token');
    }

    // Generate new tokens
    return createTokens(tokenDocument.userId.toString());
  }
  
  async revokeToken(refreshToken: string): Promise<any> {
    // Validate the token
    const { error } = Joi.string().required().validate(refreshToken);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Find and delete the token document
    const result = await Token.findOneAndDelete({ refreshToken });
    if (!result) {
      throw new ValidationError('Invalid refresh token');
    }

    return { message: 'Token revoked successfully' };
  }
}

export const accessService = new AccessService();
