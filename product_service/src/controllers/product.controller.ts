// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import { productService } from '../services/product.service';

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body, req.user.id);
      return res.status(201).json(product);
    } catch (err) {
      ErrorHandler.handleError(err as Error, res);
    }
  }
}
