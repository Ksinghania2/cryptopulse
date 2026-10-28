# CryptoPulse

Full-stack crypto dashboard: Angular 17 frontend + Spring Boot 3.4 backend, backed by PostgreSQL and Redis.

## Architecture

- `src/` — Angular 17 standalone app (TypeScript, SCSS, Tailwind).
- `backend/` — Spring Boot 3.4 (Java 17) REST API.
- `backend/docker-compose.yml` — PostgreSQL (pgvector), Redis, pgAdmin.

## Prerequisites

- Node.js 18 or 20 LTS (Angular 17 does not support Node 24).
- Java 17+ (tested with 25).
- Maven 3.9+ (or use `backend/mvnw`).
- Docker (for Postgres/Redis).

## Run the backend

```bash
cd backend
docker compose up -d          # starts Postgres (5433), Redis (6379), pgAdmin (5050)
mvn spring-boot:run           # API on http://localhost:8080
```

## Run the frontend

```bash
npm install
npm start                     # dev server on http://localhost:4200
```

## Build

```bash
npm run build                 # Angular production build -> dist/crypto-pulse
cd backend && mvn package     # Spring Boot jar
```

## Tests

```bash
npm test                      # Karma/Jasmine (frontend)
cd backend && mvn test        # JUnit (backend)
```

## Configuration

- Frontend API base URL: `src/environments/environment.ts` (`javaUrl`).
- Backend DB/Redis/CORS: `backend/src/main/resources/application.properties`
  (`app.cors.allowed-origin`, `spring.datasource.*`).

## Notes

- Whale transactions are synthetically generated for demo purposes.
- MetaMask is required for wallet features.
