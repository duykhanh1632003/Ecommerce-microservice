// src/services/access.service.ts
import { IUser } from '../interfaces/user.interfaces';
import { User } from '../models/user.model';
import { createTokens } from '../utils/authUtils';
import { ValidationError } from '../utils/errorHandler';
import { registerValidation, loginValidation } from '../validations/auth.validation';
import { Token } from '../models/token.model';
import * as Joi from 'joi';

export class AccessService {
  async createUser(userData: IUser): Promise<any> {
    // Validate user data
    const { error } = registerValidation.validate(userData);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Create and save the user
    const user = new User(userData);
    await user.save();

    // Generate tokens
    return createTokens(user._id);
  }

  async loginUser(email: string, password: string): Promise<any> {
    // Validate login data
    const { error } = loginValidation.validate({ email, password });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Validate password
    if (!user || !(await user.comparePassword(password))) {
      throw new ValidationError('Invalid email or password');
    }

    // Generate tokens
    return createTokens(user._id);
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
    return createTokens(tokenDocument.userId);
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
