# Deployment Strategy

FPT-Market utilizes a modern, serverless-friendly CI/CD pipeline. The monorepo structure requires specific build configurations to ensure the frontend and backend are deployed to their respective environments independently.

## Frontend Deployment (Vercel)

The Next.js client is deployed to Vercel. Vercel provides native, optimized support for Next.js App Router, SSG, and edge caching.

### Step-by-Step CI/CD Logic:
1. **Repository Connection**: Link the GitHub repository to a new Vercel Project.
2. **Root Directory Configuration**: 
   - **Crucial Step**: Since this is a monorepo, set the "Root Directory" in the Vercel project settings to `client`. This tells Vercel to ignore the `server` and `docs` folders.
3. **Build Command**: Vercel will automatically detect Next.js. The build command defaults to `npm run build`.
4. **Environment Variables**: Inject the production environment variables (e.g., `NEXT_PUBLIC_API_URL`) into the Vercel dashboard.
5. **Continuous Deployment**: Every push to the `main` branch triggers an isolated build and deployment of the `/client` directory.

## Backend Deployment (Render / Railway)

The Spring Boot server is deployed to an optimized container-hosting platform like Render or Railway.

### Step-by-Step CI/CD Logic (via Dockerfile):
1. **Repository Connection**: Link the GitHub repository to a new Render "Web Service" or Railway project.
2. **Root Directory Configuration**: 
   - Set the Root Directory to `/server`.
3. **Environment Strategy**: 
   - Select "Docker" as the environment type (rather than native Java).
   - The platform will use the multi-stage `Dockerfile` located in the `/server` directory to compile the Java code via Maven and package it into a lightweight OpenJDK runtime image.
4. **Database Provisioning**: Provision a managed MySQL 8.0 instance on the platform.
5. **Environment Variables**: Inject the Spring Boot properties (e.g., `SPRING_DATASOURCE_URL`, `JWT_SECRET`) directly into the service's environment variables.
6. **Continuous Deployment**: Every push to the `main` branch triggers a Docker image build and deployment for the `/server` directory.

## Automated Testing (Pre-Deployment)

Before any deployment proceeds, GitHub Actions runs the CI workflow:
- **Frontend**: Runs `npm run lint` and any Jest unit tests.
- **Backend**: Runs `./mvnw clean test` to execute JUnit and Mockito test suites.
If any tests fail, the deployment is aborted.
