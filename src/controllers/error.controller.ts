import { NextFunction, Request, Response } from "express";
import { nodeEnv } from "../shared/types/types";
import { AppErrorInterface } from "../shared/interfaces";
import {
  handleCastError,
  handleDuplicateError,
  handleErrorDev,
  handleErrorProd,
  handleValidationError,
} from "../models/error.model";
import { mongo } from "mongoose";

export default (
  err: AppErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const nodeEnv = process.env.NODE_ENV as nodeEnv;
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;

  if (nodeEnv === "development") {
    handleErrorDev(err, res);
  } else if (nodeEnv === "production") {
    let error = err;

    // ERROR CAST
    if (error.name === "CastError") error = handleCastError(error);
    // ERROR VALIDATION
    if (error.name === "ValidationError") error = handleValidationError(error);
    // ERROR DUPLICATE
    if (error instanceof mongo.MongoError && error.code === 11000)
      error = handleDuplicateError(error);
    handleErrorProd(error, res);
  }
};
