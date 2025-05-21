# Dockerfile
FROM node:22-bullseye

WORKDIR /app

# Downgrade NPM to a safe version
RUN npm install -g npm@9

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]
