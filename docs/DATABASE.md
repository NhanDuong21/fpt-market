# Database Schema

FPT-Market uses MySQL 8.0 as its primary relational database. The schema is highly normalized to ensure data integrity.

## Entity Relationships

- **User** has many **Products** (One-to-Many).
- **Category** has many **Products** (One-to-Many).
- **Product** has many **ProductImages** (One-to-Many).
- **Order** (Phase 4) will belong to one **User** (Many-to-One).

## Tables

### 1. Users
- `id` (BIGINT, PK)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `full_name` (VARCHAR)
- `phone` (VARCHAR)
- `role` (ENUM: 'ADMIN', 'USER')
- `status` (ENUM: 'ACTIVE', 'BANNED')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Categories
- `id` (BIGINT, PK)
- `name` (VARCHAR, UNIQUE)
- `slug` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. Products
- `id` (BIGINT, PK)
- `category_id` (BIGINT, FK)
- `user_id` (BIGINT, FK)
- `name` (VARCHAR)
- `slug` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `price` (DECIMAL)
- `quantity` (INT)
- `condition_type` (ENUM: 'NEW', 'USED')
- `status` (ENUM: 'PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'HIDDEN')
- `reject_reason` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Product Images
- `id` (BIGINT, PK)
- `product_id` (BIGINT, FK)
- `image_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
