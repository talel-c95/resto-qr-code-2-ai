import { Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {CustomerRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}