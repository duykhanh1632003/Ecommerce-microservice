// src/config/connectdb.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../config/logger';
import config from '../config';

dotenv.config();

const connectDB = async () => {

  try {
    await mongoose.connect(config.mongoDbUri, {
      // No need to include useNewUrlParser or useUnifiedTopology in recent Mongoose versions
      // Mongoose uses these options by default.
      dbName: 'user_service' || 'default_db', // Optional: If you want to specify a DB name
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
      socketTimeoutMS: 45000, // Keep the connection alive for 45 seconds
    });

    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if unable to connect to the database
  }
};

export default connectDB;
