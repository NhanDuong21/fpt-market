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
