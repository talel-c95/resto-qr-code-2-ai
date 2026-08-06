import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getRevenueSummary() {
  const completedOrders = await Order.find({ status: "completed" }).sort({ createdAt: -1 });

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = completedOrders.length;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  const today = startOfDay(new Date());
  const todayRevenue = completedOrders
    .filter((o) => o.createdAt >= today)
    .reduce((sum, o) => sum + o.total, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const weekOrders = completedOrders.filter((o) => o.createdAt >= sevenDaysAgo);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);

  const dailyMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of weekOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + order.total);
    }
  }
  const dailyRevenue = Array.from(dailyMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  const completedOrderIds = completedOrders.map((o) => o._id.toString());
  const items = await OrderItem.find({ orderId: { $in: completedOrderIds } });

  const itemStatsMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const item of items) {
    const existing = itemStatsMap.get(item.menuItemId) ?? { name: item.name, quantity: 0, revenue: 0 };
    existing.quantity += item.quantity;
    existing.revenue += item.price * item.quantity;
    itemStatsMap.set(item.menuItemId, existing);
  }
  const topItems = Array.from(itemStatsMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    totalRevenue,
    todayRevenue,
    weekRevenue,
    orderCount,
    averageOrderValue,
    dailyRevenue,
    topItems,
  };
}