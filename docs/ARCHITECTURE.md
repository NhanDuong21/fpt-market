# System Architecture

FPT-Market follows a strict monorepo architecture. This document outlines the high-level system design, communication protocols, and architectural patterns employed across the platform.

## Monorepo Layout

The application is structured into three distinct, isolated environments at the root level:

```text
fpt-market/
├── client/
│   # Next.js App Router (JavaScript/JSX). No business logic related to data persistence.
│   # Exclusively handles UI rendering, client-side routing, and state presentation.
├── server/
│   # Spring Boot REST API (Java). The single source of truth for business rules,
│   # database interactions, security, and transaction management.
└── docs/
    # The current directory. Contains all architectural and operational blueprints.
```

## Architectural Patterns

### 1. Separation of Concerns
The frontend and backend are completely decoupled. They communicate exclusively via RESTful HTTP calls over network boundaries. The frontend never accesses the database directly, and the backend never serves HTML/UI components.

### 2. Stateless Backend
The Spring Boot backend is completely stateless. No session data is stored in server memory (e.g., `HttpSession`). All authentication and authorization are managed via short-lived JWT Access Tokens and long-lived Refresh Tokens.

### 3. Layered Backend Architecture
The server adheres to a strict 5-tier architecture:
`Controller -> Service Interface -> Service Implementation -> Repository -> Entity`.
This ensures testability and loose coupling.

### 4. DTO Pattern (Data Transfer Object)
Entities are strictly confined to the Repository and Service layers. They are **never** returned by Controllers or exposed to the client. MapStruct is used to map Entities to DTOs before data crosses the network boundary.

## High-Level Data Flow

1. **Client Request**: The user interacts with the Next.js frontend (`/client`).
2. **Service Layer**: The frontend's isolated service layer (Axios instance) constructs the HTTP request, attaching the JWT if required.
3. **Gateway/Security**: The request hits the Spring Boot backend (`/server`). The Spring Security filter chain intercepts the request, validates the JWT, and enforces rate limits.
4. **Controller**: The request is routed to the appropriate REST Controller.
5. **Business Logic**: The Controller delegates the operation to the Service Layer interface.
6. **Persistence**: The Service Implementation uses Spring Data JPA Repositories to read/write from the MySQL database.
7. **Response**: Data is mapped to a DTO and wrapped in the standard API Response envelope, then sent back to the frontend.
