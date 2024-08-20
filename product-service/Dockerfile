# Base image
FROM node:18-alpine
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (transpile TypeScript to JavaScript)
RUN npm run build

# Expose port
EXPOSE 3003

# Command to run the application
CMD ["node", "dist/index.js"]
