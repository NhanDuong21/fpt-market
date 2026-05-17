package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.config.VNPayConfig;
import com.fptmarket.dto.response.PaymentResponse;
import com.fptmarket.entity.*;
import com.fptmarket.exception.AppException;
import com.fptmarket.repository.OrderRepository;
import com.fptmarket.repository.PaymentRepository;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VNPayConfig vnPayConfig;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              OrderRepository orderRepository,
                              UserRepository userRepository,
                              VNPayConfig vnPayConfig) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.vnPayConfig = vnPayConfig;
    }

    @Override
    public String createVNPayUrl(Order order, String ipAddress) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_TxnRef = order.getId().toString() + "_" + System.currentTimeMillis();
            String vnp_OrderInfo = "Thanh toan don hang " + order.getId();
            String vnp_OrderType = "other";
            String vnp_Locale = "vn";

            long amountInCents = order.getTotalAmount().multiply(new BigDecimal(100)).longValue();

            java.time.ZoneId zoneId = java.time.ZoneId.of("Asia/Ho_Chi_Minh");
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

            String vnp_CreateDate = java.time.LocalDateTime.now(zoneId).format(formatter);
            String vnp_ExpireDate = java.time.LocalDateTime.now(zoneId).plusMinutes(15).format(formatter);

            log.info("Generated VNPay Payment Attempt - TxnRef: {}, CreateDate: {}, ExpireDate: {}", vnp_TxnRef, vnp_CreateDate, vnp_ExpireDate);

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(amountInCents));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", vnp_OrderType);
            vnp_Params.put("vnp_Locale", vnp_Locale);
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", (ipAddress == null || ipAddress.isEmpty()) ? "127.0.0.1" : ipAddress);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            String queryUrlAndHash = VNPayConfig.hashAllFields(vnp_Params, vnPayConfig.getHashSecret());
            String finalUrl;
            if (vnPayConfig.isMock()) {
                // Mock mode: Redirect directly to the returnUrl (frontend result page)
                // Append mock=true to the URL
                finalUrl = vnPayConfig.getReturnUrl() + "?" + queryUrlAndHash + "&mock=true";
                log.info("[DEV ONLY] VNPay Mock Mode Enabled - redirecting directly to frontend: {}", finalUrl);
            } else {
                // Real sandbox mode: Redirect to the official VNPay gateway
                finalUrl = vnPayConfig.getUrl() + "?" + queryUrlAndHash;
                log.info("VNPay Real Sandbox Mode - redirecting to gateway: {}", finalUrl);
            }
            return finalUrl;

        } catch (Exception e) {
            log.error("Failed to generate VNPay redirect URL", e);
            throw new AppException("Failed to generate VNPay redirect URL", ErrorCode.BAD_REQUEST.getCode());
        }
    }

    @Override
    @Transactional
    public PaymentResponse vnpayCallback(Map<String, String> queryParams) {
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        if (vnp_SecureHash == null) {
            throw new AppException("Chữ ký VNPay không hợp lệ", ErrorCode.BAD_REQUEST.getCode());
        }

        // Remove signature keys
        Map<String, String> signFields = new HashMap<>(queryParams);
        signFields.remove("vnp_SecureHash");
        signFields.remove("vnp_SecureHashType");
        
        // Remove mock key to avoid interfering with hash verification if it is included
        String mockParam = signFields.remove("mock");

        // Sort keys
        List<String> fieldNames = new ArrayList<>(signFields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = signFields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    log.error("Failed to URL encode field", e);
                }
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String signValue = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        boolean isSignatureValid = signValue.equals(vnp_SecureHash);

        if (!isSignatureValid) {
            if (vnPayConfig.isMock() || "true".equals(queryParams.get("mock")) || "true".equals(mockParam)) {
                log.warn("[DEV ONLY] VNPay Mock Mode Signature mismatch bypassed.");
            } else {
                log.error("Signature mismatch. Calculated: {}, Received: {}", signValue, vnp_SecureHash);
                throw new AppException("Sai chữ ký", ErrorCode.INVALID_SIGNATURE.getCode());
            }
        }

        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        if (vnp_TxnRef == null) {
            throw new AppException("Order ID missing from callback", ErrorCode.BAD_REQUEST.getCode());
        }

        Long orderId = Long.parseLong(vnp_TxnRef.split("_")[0]);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException("Payment not found", ErrorCode.NOT_FOUND.getCode()));

        // Idempotency Check: If payment is already PAID, return immediately to prevent double processing
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            log.info("Payment already PAID for Order ID: {}. Returning early without modifications.", orderId);
            return mapToResponse(payment);
        }

        String responseCode = queryParams.get("vnp_ResponseCode");
        
        // In mock mode, if it is a bypass, or if the developer redirected without standard vnpay sandbox parameters, 
        // they might not have vnp_ResponseCode, so let's default to "00" (Paid) if mock mode is true and responseCode is empty
        if (responseCode == null && (vnPayConfig.isMock() || "true".equals(queryParams.get("mock")))) {
            responseCode = "00";
        }

        if ("00".equals(responseCode)) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransactionNo(queryParams.getOrDefault("vnp_TransactionNo", "MOCK_" + System.currentTimeMillis()));
            payment.setBankCode(queryParams.getOrDefault("vnp_BankCode", "NCB"));
            payment.setPaidAt(LocalDateTime.now());

            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);

            // TODO: Send Payment Success Email
            log.info("Payment and order confirmed successfully. Payment ID: {}", payment.getId());
        } else if ("24".equals(responseCode)) {
            payment.setPaymentStatus(PaymentStatus.CANCELLED);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            log.warn("Payment cancelled by customer for Order ID: {}", orderId);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.PENDING); // keep pending for retry if failed
            orderRepository.save(order);
            log.warn("Payment failed for Order ID: {} with code: {}", orderId, responseCode);
        }

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException("Payment not found for order", ErrorCode.NOT_FOUND.getCode()));

        User user = getCurrentUser();
        if (!payment.getOrder().getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AppException("You do not have permission to view this payment", ErrorCode.FORBIDDEN.getCode());
        }

        return mapToResponse(payment);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .amount(payment.getAmount())
                .transactionNo(payment.getTransactionNo())
                .bankCode(payment.getBankCode())
                .paymentUrl(payment.getPaymentUrl())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
