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
├── gateway/                # API Gateway 
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

## University of Rwanda SSO

This API accepts Inuma OIDC tokens on `POST /v2/auth/sso` and `POST /v2/auth/sso/:position_id`. Tokens are validated against `{SSO_ISSUER}/jwks`. Local ImoTrak roles stay in this database — Inuma `role` / `ur_roles` are identity context only.

Required env vars: `SSO_ISSUER`, `SSO_CLIENT_ID`. Optional: `SSO_AUTO_PROVISION` (default `true`) to find-or-create a local user by email or `sub`. Ask the SSO admin to register this app’s redirect URI on the frontend, not on this API.

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
$ git clone https://github.com/binaryhubrw/imotrak-backside.git
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
The gateway (in `gateway/`) will route external traffic to internal services securely. We will also use an API gateway like **Kong**, **Traefik**, or **NGINX**.

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
