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
