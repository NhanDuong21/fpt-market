# Environment Configuration

This document lists all required environment variables for both the local and production environments.

> **WARNING**: Never commit real secrets to version control. Use `.env.local` for the frontend and `application-local.properties` for the backend during development.

## Frontend (`client/.env.local`)

These variables are required by the Next.js application. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Third-party Integrations (if any are handled client-side)
# e.g., Google Analytics, reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=dummy_recaptcha_site_key_12345
```

## Backend (`server/src/main/resources/application.properties`)

These properties configure the Spring Boot application, database connections, security, and third-party services.

```properties
# ===============================
# DATABASE CONFIGURATION (MySQL)
# ===============================
spring.datasource.url=jdbc:mysql://localhost:3306/fpt_market_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=dummy_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# ===============================
# JWT SECURITY
# ===============================
# 512-bit secret key for HMAC-SHA512
app.security.jwt.secret=dummy_jwt_secret_key_that_is_at_least_512_bits_long_and_very_secure_1234567890
app.security.jwt.expiration=900000          # 15 minutes in milliseconds
app.security.jwt.refresh-expiration=604800000 # 7 days in milliseconds

# ===============================
# CLOUDINARY (Image Hosting)
# ===============================
cloudinary.cloud-name=dummy_cloud_name
cloudinary.api-key=dummy_api_key_12345
cloudinary.api-secret=dummy_api_secret_abcde

# ===============================
# VNPAY INTEGRATION
# ===============================
vnpay.tmn-code=DUMMYTMN
vnpay.hash-secret=DUMMY_VNPAY_HASH_SECRET_KEY_987654321
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:3000/checkout/vnpay-return

# ===============================
# EMAIL CONFIGURATION (SMTP)
# ===============================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=dummy_email@gmail.com
spring.mail.password=dummy_app_password_abcd_efgh_ijkl
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```
