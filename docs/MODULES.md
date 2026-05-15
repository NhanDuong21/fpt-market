# System Modules

FPT-Market is architected around 12 distinct business modules. This modularity ensures that teams can develop, test, and scale features independently.

## 1. Authentication & Authorization Module
Handles the dual-token JWT lifecycle, user registration, login, logout, and token refreshing. Manages role-based endpoint security (Spring Security filter chain).

## 2. User Management Module
Responsible for user profiles, address books, password resets, and account suspension logic (Admin only).

## 3. Product Catalog Module
Manages the core product entities. Handles CRUD operations for products, search, filtering (by price, category), and pagination.

## 4. Category Management Module
Manages the hierarchical structure of product categories. Allows Admins to create, update, and delete categories and their associated metadata.

## 5. Media & Asset Module
Integrates with Cloudinary (or similar providers) for uploading, compressing, and serving product images and user avatars safely.

## 6. Cart Module
Manages the user's shopping cart state, syncing local additions with the backend database. Calculates sub-totals before checkout.

## 7. Order Processing Module
The most critical transactional module. Converts a Cart into an Order, creates historical Snapshots for `order_items`, and manages the order status lifecycle (PENDING -> PROCESSING -> SHIPPED -> DELIVERED).

## 8. Payment Gateway Module
Integrates external payment providers. Currently responsible for generating VNPay Sandbox URLs, validating HMAC-SHA512 callbacks, and updating the Order payment status securely.

## 9. Notification & Mail Module
An asynchronous service utilizing Spring Mail to dispatch transactional emails (e.g., Welcome, Order Confirmation, Password Reset) without blocking the main thread.

## 10. Inventory Management Module
Tracks stock quantities. Automatically decrements stock upon successful order placement and restores stock if an order is cancelled or refunded.

## 11. Review & Rating Module
Allows users who have successfully purchased a product to leave a rating (1-5 stars) and a text review. Calculates aggregate scores for products.

## 12. Admin Dashboard & Analytics Module
Provides aggregated data for the admin panel. Generates metrics such as total revenue, top-selling products, active user counts, and order volume over time.
