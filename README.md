# FPT-Market (Monorepo)

This repository contains the full stack architecture for FPT-Market.

- `/client` - Next.js App Router Frontend
- `/server` - Spring Boot REST API
- `/docs` - System Documentation        

## How to Run Phase 1 Locally

### 1. Start Infrastructure         
Run the following at the root to start the MySQL database and Adminer GUI:
```bash
docker-compose up -d
```
Access Adminer at `http://localhost:8081`.

### 2. Start Backend
Navigate to `/server` and start Spring Boot:
```bash
cd server
./mvnw spring-boot:run
```
The API is available at `http://localhost:8080`.
Health Check: `http://localhost:8080/api/health`

### 3. Start Frontend
Navigate to `/client`, install dependencies, and start Next.js:
```bash
cd client
npm install
npm run dev
```
The frontend is available at `http://localhost:3000`.     
