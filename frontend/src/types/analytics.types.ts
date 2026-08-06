export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  dailyRevenue: DailyRevenue[];
  topItems: TopItem[];
}