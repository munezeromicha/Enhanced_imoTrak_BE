# Imotarak Fleet Management System

A modular, microservice-based Node.js/TypeScript backend for managing fleets, vehicles, reservations, and more. Built with Express, Prisma, and Docker — structured as a monorepo for scalability and maintainability.

---

## 📦 Monorepo Structure

```bash
.
├── services/
│   ├── auth-service/
│   ├── organization-service/
│   ├── user-management-service/
│   ├── vehicle-management-service/
│   ├── reservation-service/
│   ├── notification-service/
│   └── audit-logs-service/
├── gateway/                # API Gateway (optional)
├── shared/                 # Shared types, utils, middleware
├── docker-compose.yml      # Local service orchestration
├── .env.example
└── README.md
```

Each service is fully isolated with:
- Its own `package.json`, `.env`, `.gitignore`
- Independent Prisma schema and migration history
- GitHub Actions workflow at `.github/workflows/deploy.yml`

---

## ⚙️ Tech Stack

| Layer             | Tech                         |
|------------------|------------------------------|
| Language         | Node.js, TypeScript          |
| Framework        | Express.js                   |
| ORM              | Prisma (PostgreSQL)          |
| Auth             | JWT-based (via Auth Service) |
| CI/CD            | GitHub Actions per service   |
| Containerization | Docker, docker-compose       |
| Messaging (opt.) | Redis, NATS, or RabbitMQ     |

---

## 🚀 Getting Started (Local Dev)

> Ensure you have Docker and Node.js (18+) installed

```bash
# Clone the repo
$ git clone <your-repo-url>
$ cd imotarak-backside

# Copy env variables (adjust as needed)
$ cp .env.example .env

# Start all services
$ docker-compose up --build
```

You can also start a single service for development:

```bash
cd services/auth-service
npm install
npm run dev
```

---

## 🌐 API Gateway
The optional gateway (in `gateway/`) can route external traffic to internal services securely. You can also use an API gateway like **Kong**, **Traefik**, or **NGINX**.

---

## ✅ GitHub Actions
Each service has its own CI/CD workflow in:
```
services/<service>/.github/workflows/deploy.yml
```
These are triggered on push and build Docker images for each service independently.
---

## 📚 License

This software is licensed under the **TEKiNOVA Proprietary License**.  
Unauthorized use, distribution, or modification is strictly prohibited.  
See [LICENSE.md](./LICENSE.md) for full terms.

---
## 📄 Maintainer
**Imotarak Team** — TEKiNOVA
