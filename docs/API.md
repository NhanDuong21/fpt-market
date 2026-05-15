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

**POST** `/api/v1/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbG... (15-min expiry)",
    "refreshToken": "def456... (7-day expiry)",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  },
  "timestamp": 1715690000,
  "errorCode": null
}
```

### 2. User Profile

**GET** `/api/v1/users/profile`
*Headers: Authorization: Bearer <accessToken>*

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0123456789"
  },
  "timestamp": 1715690050,
  "errorCode": null
}
```

### 3. Product Pagination

**GET** `/api/v1/products?page=0&size=12`
*Note: Default pagination size is 12.*

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "content": [
      {
        "id": 101,
        "name": "Mechanical Keyboard",
        "price": 150.00,
        "imageUrl": "https://..."
      }
      // ... up to 11 more items
    ],
    "pageNumber": 0,
    "pageSize": 12,
    "totalElements": 45,
    "totalPages": 4,
    "isLast": false
  },
  "timestamp": 1715690100,
  "errorCode": null
}
```

### 4. Order Management

**POST** `/api/v1/orders`
*Headers: Authorization: Bearer <accessToken>*

**Request:**
```json
{
  "shippingAddress": "123 Main St, City",
  "paymentProvider": "VNPAY"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": 505,
    "totalAmount": 150.00,
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  },
  "timestamp": 1715690200,
  "errorCode": null
}
```

### 5. Error Example (Token Expired)

**Response (Error - 401 Unauthorized):**
```json
{
  "success": false,
  "message": "Access token has expired",
  "data": null,
  "timestamp": 1715690300,
  "errorCode": "AUTH_TOKEN_EXPIRED"
}
```
