import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppError } from "../utils/errors";

interface CreateOrderInput {
  tableId: string;
  customerId?: string;
  items: { menuItemId: string; name: string; quantity: number; price: number }[];
  total: number;
}

export async function createOrder(input: CreateOrderInput) {
  const order = await Order.create({
    tableId: input.tableId,
    customerId: input.customerId,
    total: input.total,
    status: "pending",
  });

  const orderItems = await OrderItem.insertMany(
    input.items.map((item) => ({
      orderId: order._id.toString(),
      ...item,
    }))
  );

  return { order, items: orderItems };
}

export async function getOrderById(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  const items = await OrderItem.find({ orderId });
  return { order, items };
}

export async function getOrderHistory(customerId: string) {
  const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
  return orders;
}