export interface StaffOrderStatisticsResponseDto {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    completedRevenue: number;
}