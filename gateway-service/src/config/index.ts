const dotenv = require("dotenv")
const path = require("path")
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

interface Config{
    port: number;
    authServiceUrl: string;
    cartServiceUrl: string;
    discountServiceUrl: string;
    orderServiceUrl: string;
    paymentServiceUrl: string;
    jwtSecret: string;
    mongoDbUri: string;  
}

const config: Config = {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    authServiceUrl: process.env.AUTH_SERVICE_URL as string,
    cartServiceUrl: process.env.CART_SERVICE_URL as string,
    discountServiceUrl: process.env.DISCOUNT_SERVICE_URL as string,
    orderServiceUrl: process.env.ORDER_SERVICE_URL as string,
    paymentServiceUrl: process.env.PAYMENT_SERVICE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    mongoDbUri: process.env.MONGODB_URI as string || 'mongodb://localhost:27017/gateway-service',
  };

export default config