# Base image
FROM node:18-alpine
WORKDIR /app

# Set working directory

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build
WORKDIR /app/src

# Expose port
EXPOSE 3001

# Command to run the application
CMD ["node", "index.ts"]
