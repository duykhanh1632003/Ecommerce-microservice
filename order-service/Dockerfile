﻿# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose port
EXPOSE 3000

# Command to run the application
CMD [\"npm\", \"start\"]
