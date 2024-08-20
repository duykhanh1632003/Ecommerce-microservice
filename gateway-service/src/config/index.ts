import dotenv from 'dotenv';

dotenv.config()

interface Config {
  port: number;
  userServiceUrl: string;
  sellerService: string;
  discountServiceUrl: string;
  orderServiceUrl: string;
  paymentServiceUrl: string;
  inventoryServiceUrl: string;
  productServiceUrl: string;
  reviewRatingServiceUrl: string;
  shippingServiceUrl: string;
  notificationServiceUrl: string;
  jwtSecret: string;
  mongoDbUri: string;
}



const config: Config = {
  port: parseInt(process.env.PORT as string, 10) || 3000,
  userServiceUrl: process.env.USER_SERVICE_URL as string,
  sellerService: process.env.SELLER_SERVICE_URL as string,
  discountServiceUrl: process.env.DISCOUNT_SERVICE_URL as string,
  orderServiceUrl: process.env.ORDER_SERVICE_URL as string,
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL as string,
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL as string,
  productServiceUrl: process.env.PRODUCT_SERVICE_URL as string,
  reviewRatingServiceUrl: process.env.REVIEW_RATING_SERVICE_URL as string,
  shippingServiceUrl: process.env.SHIPPING_SERVICE_URL as string,
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  mongoDbUri: process.env.MONGODB_URI as string ,
};

export default config;
