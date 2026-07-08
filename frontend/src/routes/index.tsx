import { Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {CustomerRoutes()}
    </Routes>
  );
}