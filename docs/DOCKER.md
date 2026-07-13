# Docker Infrastructure

To ensure a consistent local development environment across the team, FPT-Market utilizes Docker and Docker Compose.

## Local Development Composition
    
The `docker-compose.yml` file located at the root of the project defines the required infrastructure services.

### Services Defined

1. **MySQL Database (`db`)**
   - **Image**: `mysql:8.0`
   - **Port**: `3306` (Mapped to host `3306`)
   - **Environment**: Initializes the root password, default database (`fpt_market_db`), and default user.
   - **Volumes**: Uses a persistent volume to ensure data survives container restarts.

2. **Database GUI (`db-gui`)**
   - **Image**: `adminer` (or `phpmyadmin`)
   - **Port**: `8081` (Mapped to host `8081`)
   - **Purpose**: Provides a lightweight web interface to inspect tables, run raw SQL queries, and manage the MySQL instance without requiring a local DB client.

3. **Spring Boot Backend (`api`)**
   - **Image**: Built dynamically from the `/server` directory using a multi-stage Dockerfile.
   - **Port**: `8080` (Mapped to host `8080`)
   - **Dependencies**: Uses `depends_on` to ensure it only starts after the MySQL database is ready and accepting connections.

## docker-compose.yml Specification

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: fpt_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: fpt_market
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - fpt_network

  db-gui:
    image: adminer
    container_name: fpt_adminer
    ports:
      - "8081:8080"
    depends_on:
      - db
    networks:
      - fpt_network

  api:
    build: 
      context: ./server
      dockerfile: Dockerfile
    container_name: fpt_backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/fpt_market?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - fpt_network

volumes:
  db_data:

networks:
  fpt_network:
    driver: bridge
```
