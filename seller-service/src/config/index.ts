import dotenv from 'dotenv';

dotenv.config()

interface Config {
  port: number;
  mongoDbUri: string;
}

const config: Config = {
  port: parseInt(process.env.PORT as string, 10),
  mongoDbUri: process.env.MONGODB_URI as string || 'mongodb://localhost:27017/gateway-service',
};

export default config;
