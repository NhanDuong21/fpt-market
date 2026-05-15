# Frontend Structure

The `/client` directory contains the Next.js frontend. It is strictly configured to use the Next.js App Router paradigm.

> **CRITICAL RULE**: The frontend is written exclusively in **JavaScript/JSX**. TypeScript, Vite, and Create React App are explicitly forbidden in this architecture.

## Routing Strategy

The application leverages the full spectrum of Next.js rendering techniques based on the nature of the page:

| Route Path | Rendering Method | Justification |
| :--- | :--- | :--- |
| `/` (Home) | **SSG / ISR** | Highly cacheable. Revalidated periodically to show new featured products. |
| `/categories` | **SSG / ISR** | Category lists rarely change. Generated at build time. |
| `/products` | **SSR** | Server-Side Rendered to ensure SEO compliance and real-time accurate pricing/stock data. |
| `/products/[slug]` | **SSR / ISR** | Product details. |
| `/admin/*` | **CSR** | Client-Side Rendered. Highly interactive dashboard behind authentication guard. SEO is irrelevant. |
| `/checkout` | **CSR** | Client-Side Rendered. Dynamic user session data and payment processing. |

## State Management

Global state is managed exclusively using **React Context API**.

- **`AuthContext`**: Manages user authentication state, current user profile, and exposes `login`, `logout`, and `register` functions.
- **`CartContext`**: Manages the shopping cart contents, calculates totals, and synchronizes with local storage/backend.

## Strict Service Layer Pattern

Components **MUST NEVER** call libraries like `axios` or `fetch` directly inside `useEffect` or event handlers. All network requests must pass through a strict Service Layer.

### 1. The Axios Instance (`src/services/api.js`)
A configured Axios instance handles base URLs, default headers, and the global response/error interceptors (e.g., auto-refreshing tokens on 401).

### 2. API Services (`src/services/...`)
Specific files (e.g., `productService.js`, `authService.js`) encapsulate the endpoint calls using the Axios instance.

```javascript
// Example: src/services/productService.js
import api from './api';

export const productService = {
    getProducts: async (page = 0, size = 12) => {
        const response = await api.get(`/products?page=${page}&size=${size}`);
        return response.data; // The standard wrapper's 'data' field
    },
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
};
```

### 3. Component Usage
Components consume the service layer.

```jsx
// Example Component
import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';

export default function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        productService.getProducts()
            .then(data => setProducts(data.content))
            .catch(err => console.error(err));
    }, []);

    // ... render
}
```
