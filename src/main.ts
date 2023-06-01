import express, { NextFunction, Request } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tour.routes";
import reviewRouter from "./routes/review.routes";
import userRouter from "./routes/user.routes";
import accommodationRouter from "./routes/accommodation.routes";
import { nodeEnv } from "./shared/types/types";
import errorController from "./controllers/error.controller";
import AppError from "./shared/utils/AppError.util";

const app = express();
const nodeEnv = process.env.NODE_ENV as nodeEnv;
// 1) MIDDLEWARE
app.use(express.json());
if (nodeEnv === "development") {
  app.use(morgan("dev"));
}
// 2) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/accommodations", accommodationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/users", userRouter);
app.use("*", (req: Request, _, next: NextFunction) => {
  next(
    new AppError(
      `  La page ${req.originalUrl} que vous recherchez est introuvable. Veuillez vérifier votre demande et réessayer.`,
      404
    )
  );
});
// 3) ERROR
app.use(errorController);
export default app;
