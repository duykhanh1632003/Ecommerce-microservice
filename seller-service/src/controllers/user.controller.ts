import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import { userService } from '../services/user.service';
import mongoose from 'mongoose';
import { sendSuccessResponse } from '../utils/successHandler';

export class UserController {
  static async editInformation(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User is not authenticated' });
      }
      const userId = (req.user.id as mongoose.Types.ObjectId).toString();
      const updatedUser = await userService.updateUserInfo(userId, req.body);
      return sendSuccessResponse(res, 'Information updated successfully', updatedUser);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async updateAvatar(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User is not authenticated' });
      }
      const userId = (req.user.id as mongoose.Types.ObjectId).toString();
      const updatedUser = await userService.updateAvatar(userId, req.body.avatar);
      return sendSuccessResponse(res, 'Avatar updated successfully', updatedUser);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async updateBankInfo(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User is not authenticated' });
      }
      const userId = (req.user.id as mongoose.Types.ObjectId).toString();
      const updatedUser = await userService.updateBankInfo(userId, req.body.bank);
      return sendSuccessResponse(res, 'Bank information updated successfully', updatedUser);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User is not authenticated' });
      }
      const userId = (req.user.id as mongoose.Types.ObjectId).toString();
      const updatedUser = await userService.updateAddress(userId, req.body.address);
      return sendSuccessResponse(res, 'Address updated successfully', updatedUser);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }
}
