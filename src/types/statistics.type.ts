export interface StaffOrderStatisticsResponseDto {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completedRevenue: number;
}

export interface AdminStatisticsResponseDto {
  totalStores: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminTrendItemDto {
  date: string;
  revenue: number;
  ordersCount: number;
}

export interface TopStoreItemDto {
  storeId: string;
  storeName: string;
  totalRevenue: number;
  totalOrders: number;
  ratingAvg: number;
}

export interface TopProductItemDto {
  productId: string;
  productName: string;
  storeName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface OrderStatusDistributionResponseDto {
  pending: number;
  preparing: number;
  completed: number;
  cancelled: number;
}
