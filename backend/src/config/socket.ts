import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "../utils/jwt";
import { env } from "./env";

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.frontendUrl, "http://localhost:5173", "http://localhost:5174"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;

    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded.role === "admin") {
          socket.join("admin-room");
        }
      } catch {
      }
    }
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocket first.");
  }
  return io;
}