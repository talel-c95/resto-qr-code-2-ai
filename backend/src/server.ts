/**
 * Server entry point.
 * Connects database, starts HTTP server, and initializes Socket.IO.
 */

import http from "http";
import app from "./app";
// import { connectDatabase } from "./config/database";
// import { initSocket } from "./config/socket";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// await connectDatabase();
// initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
