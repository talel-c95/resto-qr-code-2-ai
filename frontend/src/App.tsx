/**
 * Root application component.
 * Wraps providers (Auth, Cart, Socket) and mounts routes.
 */

import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "@/context/AuthContext";
// import { CartProvider } from "@/context/CartContext";
// import { SocketProvider } from "@/context/SocketContext";
// import AppRoutes from "@/routes";

export default function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
      {/*   <CartProvider> */}
      {/*     <SocketProvider> */}
      {/*       <AppRoutes /> */}
      {/*     </SocketProvider> */}
      {/*   </CartProvider> */}
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}
