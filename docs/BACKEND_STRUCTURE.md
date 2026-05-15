# Backend Structure

The `/server` directory contains the Spring Boot (Java 17/21) backend. The application strictly adheres to a domain-driven, layered architecture to guarantee maintainability and security.

## Layered Architecture

The flow of data must strictly traverse the following layers in order. Bypassing layers (e.g., a Controller directly invoking a Repository) is strictly prohibited.

1. **Controller Layer** (`@RestController`)
   - Handles incoming HTTP requests and standardizes responses using the generic API wrapper.
   - Delegates all business logic to the Service Interface.
2. **Service Interface Layer**
   - Defines the contract of operations for a specific domain module.
3. **Service Implementation Layer** (`@Service`)
   - Contains the core business logic.
   - Manages transactions (`@Transactional`).
   - Retrieves and saves data via the Repository.
4. **Repository Layer** (`@Repository`)
   - Extends Spring Data JPA (e.g., `JpaRepository`) for database access.
5. **Entity Layer** (`@Entity`)
   - The JPA representation of the MySQL database tables.

## MapStruct and the DTO Rule

> **CRITICAL RULE**: Never expose an Entity directly to the frontend.

Entities often contain sensitive fields (e.g., password hashes) and bidirectional relationships that cause infinite recursion in JSON serialization.

- All data crossing the API boundary must be a **Data Transfer Object (DTO)**.
- **MapStruct** (`@Mapper(componentModel = "spring")`) is used to automatically generate highly performant mapping code between Entities and DTOs at compile time.

## Package Structure

The backend follows a feature-by-package (or domain-driven) structure mixed with core cross-cutting concerns:

```text
com.fpt.market
├── config/           # Application-wide configurations (e.g., Swagger, CORS, AppConfig)
├── security/         # JWT Filters, UserDetailsImpl, SecurityFilterChain
├── exception/        # Custom Exceptions and the @ControllerAdvice GlobalExceptionHandler
├── common/           # Shared utilities, Enums, and the ApiResponse wrapper
├── user/             # User module (Controller, Service, Repository, Entity, DTOs)
├── product/          # Product module
├── order/            # Order module
└── payment/          # Payment integration module
```

## Exception Handling

All exceptions are intercepted centrally by the `GlobalExceptionHandler` (`@RestControllerAdvice`). This ensures that even unhandled runtime errors do not expose stack traces to the client. Instead, they are mapped to the standard JSON API response wrapper with `success: false` and the appropriate `errorCode`.
