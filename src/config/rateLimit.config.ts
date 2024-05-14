import { Options } from "express-rate-limit";
import { ERROR_RATE_LIMIT } from "../shared/messages/error.message";
import AppError from "../shared/utils/AppError.util";

export const rateLimiteOptions: Partial<Options> = {
  max: 100,
  windowMs: 1000 * 60 * 60,
  handler: (req, res, next) => {
    next(new AppError(ERROR_RATE_LIMIT, 429));
  },
};
