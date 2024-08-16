// src/app.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from './utils/errorHandler';
import accessRoute from "./routes/access.routes"
dotenv.config();
const app = express();

app.use(express.json());
app.use('/access', accessRoute);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.handleError(err, res);
});

export default app;
