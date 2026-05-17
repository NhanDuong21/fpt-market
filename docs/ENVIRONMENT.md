# Environment Configuration

## Backend (.env or application.properties)

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `fpt_market_super_secure_secret_key_2026_dev_env_123456` |
| `DB_URL` | MySQL Connection URL | `jdbc:mysql://localhost:3306/fpt_market` |
| `DB_USER` | Database username | `root` |
| `DB_PASS` | Database password | `root` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `placeholder` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `placeholder` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `placeholder` |
| `vnp_TmnCode` | VNPay Sandbox Terminal Code | `placeholder` |
| `vnp_HashSecret` | VNPay Sandbox Secure Hash Secret | `placeholder` |
| `vnp_ReturnUrl` | VNPay Sandbox Redirect Return URL | `http://localhost:3000/payment-result` |


## Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API Base URL | `http://localhost:8080/api` |

---

### Cloudinary Setup
1. Create an account at [Cloudinary](https://cloudinary.com/).
2. Get your credentials from the Dashboard.
3. If credentials are not provided, the system defaults to a **Placeholder Mode** using `via.placeholder.com`.
