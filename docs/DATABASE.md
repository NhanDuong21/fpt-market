# Database Schema

FPT-Market uses MySQL 8.0 as its primary relational database. The schema is highly normalized to ensure data integrity.

## Entity Relationships

- **User** has many **Products** (One-to-Many).
- **Category** has many **Products** (One-to-Many).
- **Product** has many **ProductImages** (One-to-Many).
- **User** has one **Cart** (One-to-One).
- **Cart** has many **CartItems** (One-to-Many).
- **User** has many **Orders** (One-to-Many).
- **Order** has many **OrderItems** (One-to-Many).
- **Order** has one **Payment** (One-to-One).

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

### 5. Carts
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK, UNIQUE)

### 6. Cart Items
- `id` (BIGINT, PK)
- `cart_id` (BIGINT, FK)
- `product_id` (BIGINT, FK)
- `quantity` (INT)

### 7. Orders
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK)
- `full_name` (VARCHAR)
- `phone` (VARCHAR)
- `shipping_address` (VARCHAR)
- `total_amount` (DECIMAL)
- `status` (ENUM: 'PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED')
- `payment_method` (ENUM: 'COD', 'VNPAY')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)


### 8. Order Items
- `id` (BIGINT, PK)
- `order_id` (BIGINT, FK)
- `product_id` (BIGINT, FK)
- `product_name` (VARCHAR)
- `price` (DECIMAL)
- `image_url` (VARCHAR)
- `quantity` (INT)
- `subtotal` (DECIMAL)

### 9. Payments
- `id` (BIGINT, PK)
- `order_id` (BIGINT, FK, UNIQUE)
- `payment_method` (ENUM: 'COD', 'VNPAY')
- `payment_status` (ENUM: 'PENDING', 'PAID', 'FAILED', 'CANCELLED')
- `amount` (DECIMAL)
- `transaction_no` (VARCHAR)
- `bank_code` (VARCHAR)
- `payment_url` (VARCHAR(1000))
- `paid_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

