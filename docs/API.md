# API Contracts

All RESTful API endpoints strictly follow a standard response wrapper format. This ensures consistency across the entire client-server communication layer.

## Standard Response Wrapper

Every HTTP response (both success and error) MUST adhere to the following JSON structure:

```json
{
  "success": true,          // boolean: indicates operation success/failure
  "message": "String",      // string: human-readable message
  "data": {},               // object/array/null: the requested payload
  "timestamp": 1715690000,  // long: Unix epoch timestamp
  "errorCode": null         // string/null: specific error identifier if success=false
}
```

## API Endpoint Examples

### 1. Authentication (Login)

**POST** `/api/auth/login`

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "def456...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

### 2. Categories (Public)

**GET** `/api/categories`
- Fetches all available categories.

**GET** `/api/categories/{slug}`
- Fetches details of a specific category by slug.

### 3. Products (Public)

**GET** `/api/products`
- **Params**: `page`, `size`, `keyword`, `categoryId`, `minPrice`, `maxPrice`, `condition`, `sort`.
- Returns only **APPROVED** products.

**GET** `/api/products/{slug}`
- Fetches full details of a specific product.

### 4. Product Management (User)

**POST** `/api/products`
- **Headers**: `Content-Type: multipart/form-data`
- **Parts**:
    - `product`: JSON string of `ProductRequest`.
    - `images`: Array of files.

**PUT** `/api/products/{id}`
- **Headers**: `Content-Type: multipart/form-data`
- Updates an existing product (resets status to PENDING).

**DELETE** `/api/products/{id}`
- Deletes a product owned by the user.

**GET** `/api/products/me`
- Returns products listed by the currently authenticated user.

### 5. Admin Operations

**POST** `/api/admin/categories`
- Creates a new category.

**PUT** `/api/admin/categories/{id}`
- Updates a category.

**DELETE** `/api/admin/categories/{id}`
- Deletes a category.

**GET** `/api/admin/products`
- **Params**: `status` (PENDING, APPROVED, REJECTED, etc.)
- Returns all products regardless of owner.

**PUT** `/api/admin/products/{id}/approve`
- Approves a PENDING product.

**PUT** `/api/admin/products/{id}/reject`
- **Body**: `{"rejectReason": "string"}`
- Rejects a PENDING product.

**PUT** `/api/admin/products/{id}/hide`
- Hides an APPROVED product from public view.

### 6. Cart Management (User)

**GET** `/api/cart`
- Fetches current user's cart (creates one if it doesn't exist).

**POST** `/api/cart/items`
- **Body**: `{ "productId": Long, "quantity": Integer }`
- Adds item to cart. Validates stock and ownership.

**PUT** `/api/cart/items/{id}`
- **Params**: `quantity`
- Updates quantity of a cart item.

**DELETE** `/api/cart/items/{id}`
- Removes an item from cart.

**DELETE** `/api/cart/clear`
- Clears all items from current user's cart.

### 7. Order Management (User)

**POST** `/api/orders`
- **Body**: `{ "fullName": "String", "phone": "String", "shippingAddress": "String", "paymentMethod": "COD" | "VNPAY" }`
- Creates a new order. Deducts stock and snapshots product info. Returns `paymentUrl` if VNPAY is selected.

**GET** `/api/orders/my`
- **Params**: `page`, `size`
- Lists current user's orders (descending by date).

**GET** `/api/orders/{id}`
- Fetches detailed info of a specific order.

**PUT** `/api/orders/{id}/cancel`
- Cancels a PENDING or CONFIRMED order and restores stock.

### 8. Seller Order Operations (User - Seller Role)

**GET** `/api/seller/orders`
- **Params**: `page`, `size`
- Fetches incoming orders containing products owned by the active seller (filtered isolation).

**GET** `/api/seller/orders/{id}`
- Fetches isolated detailed invoice containing strictly the active seller's items in the order.

**PUT** `/api/seller/orders/{id}/confirm`
- Transitions order status from PENDING to CONFIRMED.

**PUT** `/api/seller/orders/{id}/ship`
- Transitions order status from CONFIRMED to SHIPPING.

**PUT** `/api/seller/orders/{id}/complete`
- Transitions order status from SHIPPING to COMPLETED (marks product status as SOLD if quantity <= 0).

### 9. Payment Operations

**GET** `/api/payments/vnpay/callback`
- **Params**: VNPay transaction query parameters (vnp_Amount, vnp_ResponseCode, vnp_SecureHash, etc.).
- Public endpoint called by the frontend or VNPay server to verify transaction status and complete signature handshake.

**GET** `/api/payments/order/{orderId}`
- Fetches payment details for a specific order. Ensures owner validation or admin authority.

