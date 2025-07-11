# Use the official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container (This includes your src, config, etc.)
COPY . .

# Build TypeScript files into JavaScript (optional step if you want to compile before running)
RUN npm run build

# Expose the port your app will run on
EXPOSE 4000

# Start the API Gateway (this assumes you have a "dev" script in your package.json to run the gateway in development mode)
CMD ["npm", "run", "dev"]
