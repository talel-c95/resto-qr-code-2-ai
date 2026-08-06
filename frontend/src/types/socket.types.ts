export interface AdminOrderItemPayload {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderNewPayload {
  id: string;
  tableId: string;
  status: string;
  total: number;
  createdAt: string;
  items: AdminOrderItemPayload[];
}

export interface OrderStatusPayload {
  id: string;
  status: string;
}