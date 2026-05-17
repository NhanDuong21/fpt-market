export const getPaymentMethodLabel = (method) => {
  if (method === 'COD') return 'COD';
  if (method === 'VNPAY') return 'VNPay';
  return method;
};

export const getPaymentStatusLabel = (method, status) => {
  if (method === 'COD') return 'Thanh toán khi nhận hàng';
  switch (status) {
    case 'PENDING': return 'Chờ thanh toán';
    case 'PAID': return 'Đã thanh toán';
    case 'FAILED': return 'Thanh toán thất bại';
    case 'CANCELLED': return 'Đã hủy thanh toán';
    default: return status || 'Không xác định';
  }
};

export const getPaymentStatusBadgeClass = (method, status) => {
  if (method === 'COD') return 'bg-gray-100 text-gray-800 border border-gray-200';
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'PAID': return 'bg-green-100 text-green-800 border border-green-200';
    case 'FAILED':
    case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};
