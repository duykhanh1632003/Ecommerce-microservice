// gateway/index.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import config from './config/index';
import logger from './config/logger';

dotenv.config();
const app = express();
const PORT = config.port;

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(limiter);
app.use(hpp());
// Microservice URLs
const services = {
    '/user': config.userServiceUrl,
    '/cart': config.cartServiceUrl,
    '/discount': config.discountServiceUrl,
    '/order': config.orderServiceUrl,
    '/payment': config.paymentServiceUrl,
    '/inventory': config.inventoryServiceUrl,
    '/product': config.productServiceUrl, // Proxy for product service
    '/review-rating': config.reviewRatingServiceUrl,
    '/shipping': config.shippingServiceUrl,
    '/notification': config.notificationServiceUrl,
} as const;

// Check if all service URLs are provided
Object.keys(services).forEach((service) => {
    const serviceUrl = services[service as keyof typeof services];

    if (!serviceUrl) {
        logger.error(`Missing target URL for ${service}`);
        throw new Error(`Missing target URL for ${service}`);
    }

    app.use(service, createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
    }));
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Gateway is running' });
});

app.listen(PORT, () => {
    logger.info(`Gateway service running on port ${PORT}`);
});
