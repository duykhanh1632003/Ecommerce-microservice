import express, { Request, Response, NextFunction } from 'express';
import { Options } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import csurf from 'csurf';
import hpp from 'hpp';
import config from './config/index'; // Import config
import connectToMongo from './config/mongoConnection';
import {  ClientRequest } from 'http'; // Import types
import logger from './config/logger';

dotenv.config();
const app = express();
const PORT = config.port;

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Prevent HTTP parameter pollution
app.use(hpp());

const csrfProtection = csurf({
    cookie: true,
});
app.use(csrfProtection);

connectToMongo();

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            (req as any).user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

interface CustomOptions extends Options {
    onProxyReq?: (proxyReq: ClientRequest, req: Request, res: Response) => void;
}

const services = {
    '/auth': config.authServiceUrl,
    '/cart': config.cartServiceUrl,
    '/discount': config.discountServiceUrl,
    '/order': config.orderServiceUrl,
    '/payment': config.paymentServiceUrl,
} as const;

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'Gateway is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    logger.info(`Gateway service running on port ${PORT}`);
});
