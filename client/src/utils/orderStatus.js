export const getOrderStatusLabel = (status) => {
  const statusMap = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };
  return statusMap[status] || status;
};

export const getOrderStatusBadgeClass = (status) => {
  const badgeMap = {
    PENDING: 'bg-orange-100 text-orange-600 border-orange-200',
    CONFIRMED: 'bg-blue-100 text-blue-600 border-blue-200',
    SHIPPING: 'bg-purple-100 text-purple-600 border-purple-200',
    COMPLETED: 'bg-green-100 text-green-600 border-green-200',
    CANCELLED: 'bg-gray-100 text-gray-400 border-gray-200',
  };
  return badgeMap[status] || 'bg-gray-100 text-gray-600 border-gray-200';
};

export const canBuyerCancelOrder = (status) => {
  return status === 'PENDING' || status === 'CONFIRMED';
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
