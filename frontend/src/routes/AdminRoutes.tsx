import { Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import MenuManagementPage from "@/pages/admin/MenuManagementPage";
import TablesPage from "@/pages/admin/TablesPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import WaiterCallsPage from "@/pages/admin/WaiterCallsPage";
import RevenuePage from "@/pages/admin/RevenuePage";
import AIAnalyticsPage from "@/pages/admin/AIAnalyticsPage";

export default function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="menu" element={<MenuManagementPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="waiter-calls" element={<WaiterCallsPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="ai-analytics" element={<AIAnalyticsPage />} />
      </Route>
    </>
  );
}