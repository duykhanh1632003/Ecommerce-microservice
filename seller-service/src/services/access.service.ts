import { createTokens } from '../utils/authUtils';
import { BadRequestError, NotFoundError, ValidationError } from '../utils/errorHandler';
import { Token } from '../models/token.model';
import { User } from '../models/user.model';
import {  loginValidation } from '../validations/validation'; // Ensure these are correctly imported
import { IUser } from '../interfaces/user.interface';
import Joi from 'joi';
import { emailService } from './email.service';
import jwt from 'jsonwebtoken';
import config from '../config';

export class AccessService {
async registerUser(userData: IUser): Promise<any> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const newUser = await User.create(userData);

    // Tạo token xác nhận email
    const emailToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      config.verifyEmail || 'emailSecret', // Sử dụng secret từ env
      { expiresIn: '24h' } // Token hết hạn sau 24 giờ
    );
    newUser.verificationToken = emailToken;

    await newUser.save();

    // Gửi email xác nhận
    await emailService.sendVerificationEmail(newUser.email, emailToken);

    // Tạo access và refresh tokens
    const tokens = createTokens(newUser.id);

    return {
      tokens,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        primaryPhoneNumber: newUser.primaryPhoneNumber,
      },
    };
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.verifyEmail || 'emailSecret') as { id: string; email: string };

      const user = await User.findOne({ id: decoded.id, verificationToken: token });
      if (!user) {
        throw new NotFoundError('Invalid verification token');
      }

      user.isEmailVerified = true;
      user.verificationToken = undefined; // Xóa token sau khi xác thực
      await user.save();
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }

        async loginUser(identifier: string, password: string): Promise<any> {
      // Validate login data
      const { error } = loginValidation.validate({ identifier, password });
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      // Find the user by either email or username
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      // Validate password
      if (!user || !(await user.comparePassword(password))) {
        throw new ValidationError('Invalid username/email or password');
      }

      // Generate tokens
      const tokens = await createTokens(user.id);
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
