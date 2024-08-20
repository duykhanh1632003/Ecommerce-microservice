import mongoose from "mongoose";
import config from "./index";
import logger from "./logger";

const connectToMongo = async () => {
  try {
    await mongoose.connect(config.mongoDbUri, {
      dbName: 'user_service', 
    });
    logger.info('Connected to MongoDB successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Failed to connect to MongoDB: ${error.message}`);
    } else {
      logger.error('Failed to connect to MongoDB: Unknown error occurred');
    }
    process.exit(1); 
  }
};

export default connectToMongo;
