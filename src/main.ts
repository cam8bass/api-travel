import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tour.routes";
import { nodeEnv } from "./shared/types/types";

const app = express();
const nodeEnv = process.env.NODE_ENV as nodeEnv;
// 1) MIDDLEWARE
app.use(express.json());
if (nodeEnv === "development") {
  app.use(morgan("dev"));
}
// 2) ROUTES
app.use("/api/v1/tours", tourRouter);
export default app;
