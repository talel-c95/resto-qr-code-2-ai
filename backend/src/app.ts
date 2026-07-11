import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { env } from "./config/env";

const app = express();

app.use(cors({ origin: [env.frontendUrl, "http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

app.use("/api", routes);
app.use(errorMiddleware);

export default app;