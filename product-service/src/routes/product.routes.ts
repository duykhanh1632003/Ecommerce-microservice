import { Router } from 'express';
import { authThenToken } from '../utils/authUtils';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.post('/new/product', authThenToken, ProductController.createProduct);

export default router;
