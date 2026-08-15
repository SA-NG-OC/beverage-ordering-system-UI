export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";
export type PaymentMethod = "COD";

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  storeId: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  items: CreateOrderItemDto[];
}

export interface CancelOrderDto {
  cancelReason: string;
}

export interface UpdateOrderStatusDto {
  status: "pending" | "preparing" | "completed" | "cancelled";
}

export interface OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponseDto {
  id: string;
  orderCode: string;
  customerId: string;
  storeId: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  cancelReason: string | null;
  items: OrderItemResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistoryResponseDto {
  id: string;
  orderCode: string;
  storeId: string;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}
