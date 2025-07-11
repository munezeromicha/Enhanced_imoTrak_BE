# Use the official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Build TypeScript files into JavaScript
RUN npm run build

# Run prisma generate to create the Prisma client
RUN npx prisma generate

# Expose the port your app will run on
EXPOSE 4001

# Start the app
CMD ["node", "dist/index.js"]
