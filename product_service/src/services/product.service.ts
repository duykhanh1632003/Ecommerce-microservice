// src/services/product.service.ts
import { Product } from '../models/product.model';
import { BadRequestError } from '../utils/errorHandler';
import { createProductValidation } from '../validations/validation';

export class ProductService {
  async createProduct(data: any, userId: string): Promise<any> {
    // Validate the incoming data
    const { error } = createProductValidation.validate(data);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Set the product_user field
    data.product_user = userId;

    // Create the product in the database
    const product = await Product.create(data);

    return product;
  }
}

export const productService = new ProductService();
