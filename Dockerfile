# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json first to install dependencies (caching layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code, including prisma/schema.prisma
COPY . .

# Generate Prisma client (now schema is available)
RUN npx prisma generate

# Build the TypeScript code into the dist folder
RUN npm run build

# Expose the port the app will run on
EXPOSE 4000

# Run the compiled JavaScript code from the dist folder
CMD ["node", "dist/index.js"]

# Seeding the admin account
# RUN npm run seed
