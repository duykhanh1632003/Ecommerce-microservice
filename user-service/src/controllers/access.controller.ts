import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import { accessService } from '../services/access.service';
import { tokenValidation } from '../validations/validation'; // Assuming this is where token validation is located

export class AccessController {
  static async register(req: Request, res: Response) {
    try {
      const tokens = await accessService.createUser(req.body);
      return res.status(201).json(tokens);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const tokens = await accessService.loginUser(req.body.email, req.body.password);
      return res.status(200).json(tokens);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    const { error } = tokenValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const tokens = await accessService.refreshAccessToken(req.body.refreshToken);
      return res.status(200).json(tokens);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }

  static async revokeToken(req: Request, res: Response) {
    const { error } = tokenValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const result = await accessService.revokeToken(req.body.refreshToken);
      return res.status(200).json(result);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }
}
