export const getOrderStatusLabel = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ xác nhận';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'SHIPPING':
            return 'Đang giao';
        case 'COMPLETED':
            return 'Hoàn thành';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return status;
    }
};

export const getOrderStatusBadgeClass = (status) => {
    switch (status) {
        case 'PENDING':
            return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'CONFIRMED':
            return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'SHIPPING':
            return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'COMPLETED':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'CANCELLED':
            return 'bg-gray-50 text-gray-500 border-gray-100';
        default:
            return 'bg-gray-50 text-gray-900 border-gray-100';
    }
};

export const canBuyerCancelOrder = (status) => {
    return status === 'PENDING';
};

export const canSellerConfirmOrder = (status) => {
    return status === 'PENDING';
};

export const canSellerShipOrder = (status) => {
    return status === 'CONFIRMED';
};

export const canSellerCompleteOrder = (status) => {
    return status === 'SHIPPING';
};

export const getPaymentStatusLabel = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'FAILED':
            return 'Thanh toán thất bại';
        case 'CANCELLED':
            return 'Đã hủy thanh toán';
        default:
            return status;
    }
};

export const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
        case 'PENDING':
            return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'PAID':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'FAILED':
            return 'bg-red-50 text-red-600 border-red-100';
        case 'CANCELLED':
            return 'bg-gray-50 text-gray-500 border-gray-100';
        default:
            return 'bg-gray-50 text-gray-900 border-gray-100';
    }
};

export const getPaymentMethodLabel = (method) => {
    switch (method) {
        case 'COD':
            return 'Thanh toán khi nhận hàng (COD)';
        case 'VNPAY':
            return 'Ví điện tử VNPay';
        default:
            return method;
    }
};

