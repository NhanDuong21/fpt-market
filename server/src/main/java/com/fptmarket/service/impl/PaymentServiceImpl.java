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

            java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(java.util.TimeZone.getTimeZone("Etc/GMT+7"));
            String vnp_CreateDate = formatter.format(new java.util.Date());

            java.util.Calendar cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("Etc/GMT+7"));
            cal.add(java.util.Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cal.getTime());

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
            return vnPayConfig.getUrl() + "?" + queryUrlAndHash;

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
        if (!signValue.equals(vnp_SecureHash)) {
            log.error("Signature mismatch. Calculated: {}, Received: {}", signValue, vnp_SecureHash);
            throw new AppException("Sai chữ ký", ErrorCode.INVALID_SIGNATURE.getCode());
        }

        String vnp_TxnRef = queryParams.get("vnp_TxnRef");
        if (vnp_TxnRef == null) {
            throw new AppException("Order ID missing from callback", ErrorCode.BAD_REQUEST.getCode());
        }

        Long orderId;
        if (vnp_TxnRef.contains("_")) {
            orderId = Long.parseLong(vnp_TxnRef.split("_")[0]);
        } else {
            orderId = Long.parseLong(vnp_TxnRef);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException("Payment not found", ErrorCode.NOT_FOUND.getCode()));

        String responseCode = queryParams.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransactionNo(queryParams.get("vnp_TransactionNo"));
            payment.setBankCode(queryParams.get("vnp_BankCode"));
            payment.setPaidAt(LocalDateTime.now());

            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);

            // TODO: Send Payment Success Email
            log.info("Payment and order confirmed successfully. Payment ID: {}", payment.getId());
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
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
