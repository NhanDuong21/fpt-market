# Email Triggers

FPT-Market utilizes Spring Boot Starter Mail (JavaMailSender) to handle asynchronous transactional emails.

## SMTP Configuration

The application is configured to use a standard SMTP server (e.g., Gmail, SendGrid, or AWS SES) defined in the environment properties.

**Required Properties:**
- `spring.mail.host`
- `spring.mail.port`
- `spring.mail.username`
- `spring.mail.password`

## Primary Email Triggers

All email sending operations must be executed asynchronously (`@Async`) to prevent blocking the main HTTP request thread.

### 1. Registration Welcome
- **Trigger**: Sent immediately upon successful user registration.
- **Payload**:
  - `recipientEmail`: User's email address.
  - `fullName`: User's registered full name.
  - `loginUrl`: Link to the application login page.

### 2. Order Confirmation
- **Trigger**: Sent when an order is successfully placed and the payment status becomes `COMPLETED` (or upon placement for Cash On Delivery).
- **Payload**:
  - `recipientEmail`: Buyer's email.
  - `orderId`: Unique order identifier.
  - `totalAmount`: Final amount paid.
  - `shippingAddress`: Formatted destination address.
  - `itemsList`: List of `productName`, `quantity`, and `subtotal`.

### 3. Product Approval / Rejection
- **Trigger**: Sent to the Seller when an Admin reviews a newly submitted product listing.
- **Payload**:
  - `recipientEmail`: Seller's email.
  - `productName`: Name of the submitted product.
  - `status`: 'APPROVED' or 'REJECTED'.
  - `reason`: (Optional) Admin notes if rejected.

### 4. Password Reset
- **Trigger**: Sent when a user requests a password recovery.
- **Payload**:
  - `recipientEmail`: User's email.
  - `resetToken`: A secure, short-lived (e.g., 15 mins) UUID token.
  - `resetLink`: The full URL pointing to the frontend reset form, appending the token.
