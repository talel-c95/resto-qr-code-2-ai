import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-noir font-sans">
      <Header />
      <Outlet />
    </div>
  );
}