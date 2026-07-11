import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";

export default function CustomerLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}