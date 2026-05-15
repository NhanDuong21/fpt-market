# FPT-Market

FPT-Market is a robust, full-stack, monorepo e-commerce platform. It is designed with a strict separation of concerns, utilizing modern web technologies to deliver a scalable, secure, and highly performant shopping experience.

## Project Structure

The repository follows a strict monorepo architecture, containing exactly three main directories at the root level:

```text
fpt-market/
├── client/     # Frontend Next.js App Router application (JavaScript/JSX exclusively)
├── server/     # Backend Spring Boot application (Java 17/21)
└── docs/       # Centralized technical documentation
```

## Technology Stack

### Frontend (`/client`)
- **Framework**: Next.js (App Router paradigm)
- **Language**: JavaScript/JSX (TypeScript is strictly forbidden)
- **State Management**: React Context API
- **Styling**: Tailwind CSS (or as defined in frontend structure)
- **Data Fetching**: Axios (via strict service layer)

### Backend (`/server`)
- **Framework**: Spring Boot (Java 17 or Java 21)
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Mapping**: MapStruct for Entity-DTO conversion

### Infrastructure & Deployment
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## Documentation Index

Please refer to the following comprehensive documentation files located in the `/docs` directory for detailed blueprints of the platform:

- [Architecture](./ARCHITECTURE.md) - System architecture and monorepo design.
- [Database](./DATABASE.md) - MySQL schema, relationships, and raw SQL definitions.
- [API Contracts](./API.md) - RESTful endpoints, wrappers, and request/response structures.
- [Frontend Structure](./FRONTEND_STRUCTURE.md) - Next.js App Router design, routing, and state.
- [Backend Structure](./BACKEND_STRUCTURE.md) - Spring Boot layered architecture and MapStruct usage.
- [Security](./SECURITY.md) - JWT lifecycle, rate limiting, and access control.
- [Payment Integration](./PAYMENT.md) - VNPay Sandbox flow and crypto-signature logic.
- [Email Triggers](./MAIL.md) - Spring Mail configurations and SMTP templates.
- [Docker Setup](./DOCKER.md) - Local development orchestration.
- [Deployment Strategy](./DEPLOYMENT.md) - CI/CD pipeline and hosting environments.
- [Environment Variables](./ENVIRONMENT.md) - `.env` configurations for all tiers.
- [System Modules](./MODULES.md) - The 12 core business modules.
- [Roadmap](./ROADMAP.md) - Future phases and milestones.
