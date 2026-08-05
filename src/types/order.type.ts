import type { StoreResponseDto } from "./store.type";

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface OrderItemDto {
    productId: string;
    quantity: number;
}

export interface CreateOrderDto {
    storeId: string;
    items: OrderItemDto[];
    receiverName: string;
    receiverPhone: string;
    deliveryAddress: string;
    note?: string;
}

export interface CancelOrderDto {
    cancelReason: string;
}

export interface UpdateOrderStatusDto {
    status: 'preparing' | 'completed';
}

export interface OrderItemResponseDto {
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    subtotal: number;
}

export interface OrderResponseDto {
    id: string;
    customerId: string;
    storeId: string;
    store: StoreResponseDto;
    items: OrderItemResponseDto[];
    totalAmount: number;
    status: OrderStatus;
    receiverName: string;
    receiverPhone: string;
    deliveryAddress: string;
    note: string | null;
    cancelReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface OrderHistoryResponseDto {
    id: string;
    storeId: string;
    storeName: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}