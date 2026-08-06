import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppError } from "../utils/errors";
import { getIO } from "../config/socket";

interface CreateOrderInput {
  tableId: string;
  customerId?: string;
  items: { menuItemId: string; name: string; quantity: number; price: number }[];
  total: number;
}

function emitToAdmin(event: string, payload: unknown) {
  try {
    getIO().to("admin-room").emit(event, payload);
  } catch {
    // socket layer not initialized (e.g. in tests) — safe to ignore
  }
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

  emitToAdmin("order:new", {
    id: order._id.toString(),
    tableId: order.tableId,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: orderItems.map((i) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
  });

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

export async function getAllOrders() {
  const orders = await Order.find().sort({ createdAt: -1 });
  const orderIds = orders.map((o) => o._id.toString());
  const items = await OrderItem.find({ orderId: { $in: orderIds } });

  const itemsByOrderId = new Map<string, typeof items>();
  for (const item of items) {
    const list = itemsByOrderId.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.orderId, list);
  }

  return orders.map((order) => ({
    order,
    items: itemsByOrderId.get(order._id.toString()) ?? [],
  }));
}

const VALID_STATUSES = ["pending", "accepted", "preparing", "ready", "served", "completed", "cancelled"];

export async function updateOrderStatus(orderId: string, status: string) {
  if (!VALID_STATUSES.includes(status)) {
    throw new AppError("Invalid order status", 400);
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  order.status = status as typeof order.status;
  await order.save();

  emitToAdmin("order:status", {
    id: order._id.toString(),
    status: order.status,
  });

  return order;
}