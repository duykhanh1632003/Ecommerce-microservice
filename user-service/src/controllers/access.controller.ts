// src/controllers/access.controller.ts
import { Request, Response } from 'express';
import { registerValidation, loginValidation, tokenValidation } from '../validations/auth.validation';
import { ErrorHandler } from '../utils/errorHandler'; // Assuming you have an error handler utility
import { accessService } from '../services/access.service';


export class AccessController {
  static async register(req: Request, res: Response) {
    const { error } = registerValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const tokens = await accessService.createUser(req.body);
      return res.status(201).json(tokens);
    } catch (err) {
      ErrorHandler.handleError(err, res);
    }
  }

  static async login(req: Request, res: Response) {
    const { error } = loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const tokens = await accessService.loginUser(req.body.email, req.body.password);
      return res.status(200).json(tokens);
    } catch (err) {
      ErrorHandler.handleError(err, res);
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
      ErrorHandler.handleError(err, res);
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
      ErrorHandler.handleError(err, res);
    }
  }
}
