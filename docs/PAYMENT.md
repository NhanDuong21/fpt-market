# Payment Integrations

FPT-Market handles payment processing securely by delegating the actual transaction processing to localized payment gateways. Under no circumstances does the system store raw credit card numbers or banking credentials.

## VNPay Sandbox Integration (Phase 1)

The primary payment gateway is VNPay. The integration uses the VNPay Sandbox environment for testing.

### Cryptographic Signature Validation Flow

The most critical security aspect of the payment flow is validating the callback from the VNPay server to ensure the payment status hasn't been tampered with by a malicious client.

> **CRITICAL RULE**: An order is **ONLY** marked as `COMPLETED` if the backend successfully verifies the VNPay cryptographic signature (HMAC-SHA512).

#### Step-by-Step Flow:
1. **Checkout**: The user initiates a checkout on the client.
2. **URL Generation**: The Spring Boot backend generates a VNPay payment URL. It hashes the transaction parameters using `HMAC-SHA512` and the `VNP_HASH_SECRET`.
3. **Redirect**: The client redirects the user to the VNPay portal.
4. **Transaction**: The user completes the transaction on VNPay.
5. **Callback/Return**: VNPay redirects the user back to the frontend with query parameters containing the transaction status and a `vnp_SecureHash`.
6. **Backend Verification**:
    - The frontend forwards these parameters to the backend `/api/v1/payments/vnpay/callback` endpoint.
    - The backend reconstructs the data string using the exact parameters received (excluding `vnp_SecureHash` and `vnp_SecureHashType`).
    - The backend recalculates the HMAC-SHA512 hash using the server-side `hashSecret`.
    - **Verification**: The backend compares the recalculated hash with the `vnp_SecureHash` provided by VNPay.
    - **Result**: If the hashes match AND the `vnp_ResponseCode` is `00` (Success), the Payment status is updated to `PAID`, and the Order status is updated to `CONFIRMED`. Otherwise, the Payment is marked `FAILED` and the Order remains in its current status.

## Payment Enums & Database State

### PaymentMethod
- `COD` (Thanh toán khi nhận hàng)
- `VNPAY` (Thanh toán qua cổng VNPay Sandbox)

### PaymentStatus
- `PENDING` (Chờ thanh toán)
- `PAID` (Đã thanh toán thành công)
- `FAILED` (Thanh toán thất bại)
- `CANCELLED` (Đã hủy thanh toán)


## Momo Integration (Phase 2 Placeholder)

*This section is reserved for the future integration of the Momo E-Wallet.*

- **Protocol**: Momo API V2
- **Flow**: Similar to VNPay, utilizing an RSA/HMAC signature for initial request creation and IPN (Instant Payment Notification) callback validation.
- **Status**: Pending business approval.
