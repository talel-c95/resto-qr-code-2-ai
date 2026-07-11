import http from "http";
import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function start() {
  await connectDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();