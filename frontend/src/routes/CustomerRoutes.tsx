import { Route } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import LandingPage from "@/pages/customer/LandingPage";
import GuestPage from "@/pages/customer/GuestPage";
import LoginPage from "@/pages/customer/LoginPage";
import RegisterPage from "@/pages/customer/RegisterPage";
import QRScanPage from "@/pages/customer/QRScanPage";
import MenuPage from "@/pages/customer/MenuPage";
import CartPage from "@/pages/customer/CartPage";
import CheckoutPage from "@/pages/customer/CheckoutPage";
import OrderTrackingPage from "@/pages/customer/OrderTrackingPage";
import ReceiptPage from "@/pages/customer/ReceiptPage";
import OrderHistoryPage from "@/pages/customer/OrderHistoryPage";

export default function CustomerRoutes() {
  return (
    <Route element={<CustomerLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/guest" element={<GuestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/scan" element={<QRScanPage />} />
      <Route path="/menu/:tableId" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders/:id" element={<OrderTrackingPage />} />
      <Route path="/receipt/:id" element={<ReceiptPage />} />
      <Route path="/history" element={<OrderHistoryPage />} />
    </Route>
  );
}