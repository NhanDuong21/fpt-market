# Security Protocols

FPT-Market implements multiple layers of defense to secure user data, maintain platform integrity, and protect against automated attacks.

## JWT Lifecycle

Authentication relies on a stateless dual-token architecture:

1. **Access Token (Short-Lived):**
   - Expiration: **15 Minutes**.
   - Storage: Kept in memory by the frontend (React Context) or as an HttpOnly session cookie (depending on final frontend implementation).
   - Usage: Attached as a Bearer token in the `Authorization` header for protected endpoints.
2. **Refresh Token (Long-Lived):**
   - Expiration: **7 Days**.
   - Storage: Stored securely in the backend database (and returned to the client securely).
   - Usage: Used strictly against the `/api/v1/auth/refresh` endpoint to obtain a new Access Token.

### Client-Side Auto-Refresh (Axios Interceptor)
The frontend utilizes an Axios response interceptor. When an API call returns a `401 Unauthorized` with an `AUTH_TOKEN_EXPIRED` code, the interceptor pauses the request queue, silently requests a new Access Token using the Refresh Token, and seamlessly replays the original failed requests.

## Role-Based Access Control (RBAC)

Authorization is strictly enforced at the endpoint level based on three primary roles:
- **PUBLIC**: Unauthenticated users (e.g., browsing products, login, register).
- **USER**: Authenticated buyers/sellers (e.g., placing orders, managing profile).
- **ADMIN**: System administrators (e.g., category management, system metrics).

In Spring Boot, this is enforced using `@PreAuthorize("hasRole('ADMIN')")` on Controller methods.

## Defense Strategies

To protect the marketplace from malicious actors, the following strategies are required:

### 1. Rate Limiting (Bucket4j / Redis)
- **Login/Register Endpoints**: Restricted to 5 attempts per IP per minute to prevent credential stuffing and brute-force attacks.
- **General APIs**: Restricted to 100 requests per IP per minute to mitigate basic DDoS.

### 2. Anti-Scraping Guards
To prevent unauthorized mass-scraping of product catalog and pricing data:
- Implementation of dynamic User-Agent validation.   
- Aggressive rate limiting on public catalog endpoints (e.g., `/api/v1/products`).
- (Optional Phase 2): IP blacklisting via WAF (Web Application Firewall) if anomalous volumetric traffic is detected from non-consumer datacenters.    

### 3. Vulnerability Probing Protection
- **Mass-Scanning**: The `GlobalExceptionHandler` masks all internal 500 errors. No database structure, Spring Boot version, or stack trace is ever leaked.
- **SQL Injection**: Prevented entirely by enforcing the use of Spring Data JPA and parameterized Hibernate queries. Raw string concatenation for SQL is strictly forbidden.
- **XSS**: Next.js automatically sanitizes DOM injections. Spring Boot sanitizes incoming JSON payloads.     
