import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Receipt } from "../models/Receipt";
import { AppError } from "../utils/errors";

export async function getReceiptForOrder(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const items = await OrderItem.find({ orderId });

  // Record that a receipt was generated (upsert, so viewing twice doesn't duplicate)
  await Receipt.findOneAndUpdate(
    { orderId },
    { orderId, generatedAt: new Date() },
    { upsert: true }
  );

  return {
    orderId: order._id.toString(),
    tableId: order.tableId,
    total: order.total,
    createdAt: order.createdAt,
    items: items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
  };
}