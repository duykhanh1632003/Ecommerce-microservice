import dotenv from 'dotenv';

dotenv.config()

interface Config {
  port: number;
  mongoDbUri: string;
  email: string
  passEmail: string
  emailPort: number
  emailHost: string,
  baseUrl: string,
  verifyEmail:string
}

const config: Config = {
  port: parseInt(process.env.PORT as string, 10),
  mongoDbUri: process.env.MONGODB_URI as string || 'mongodb://localhost:27017/gateway-service',
  email: process.env.EMAIL_USER as string ,
  passEmail: process.env.EMAIL_PASS as string,
  emailPort: parseInt(process.env.EMAIL_PORT as string, 10),
  emailHost: process.env.EMAIL_HOST as string,
  baseUrl: process.env.BASE_URL as string,
  verifyEmail: process.env.EMAIL_VERIFICATION_SECRET as string,
};
  
export default config;
