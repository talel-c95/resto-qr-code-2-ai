import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { AdminAuthContext } from "@/context/AdminAuthContext";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

export const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const adminAuth = useContext(AdminAuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = connectSocket(adminAuth?.token ?? undefined);
    setSocket(s);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);

    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      disconnectSocket();
    };
  }, [adminAuth?.token]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
}