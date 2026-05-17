export const getPaymentMethodLabel = (method) => {
  if (method === 'COD') return 'Thanh toán khi nhận hàng';
  if (method === 'VNPAY') return 'VNPay';
  return method || 'Không xác định';
};

export const getPaymentStatusLabel = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ thanh toán';
    case 'PAID': return 'Đã thanh toán';
    case 'FAILED': return 'Thanh toán thất bại';
    case 'CANCELLED': return 'Đã hủy thanh toán';
    default: return status || 'Không xác định';
  }
};

export const getPaymentStatusBadgeClass = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    case 'PAID': return 'bg-green-50 text-green-600 border border-green-200';
    case 'FAILED':
    case 'CANCELLED': return 'bg-red-50 text-red-600 border border-red-200';
    default: return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};
