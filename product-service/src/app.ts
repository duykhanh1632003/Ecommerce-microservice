// src/app.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from './utils/errorHandler';
import productRoutes from "./routes/product.routes"

import connectDB from './db/connectDB';
dotenv.config();
const app = express();

app.use(express.json());

app.use('/', productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.handleError(err, res);
});

connectDB()

export default app;
