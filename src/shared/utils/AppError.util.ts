import { AppErrorInterface } from "../interfaces";
import { errorStatus } from "../types/types";

export default class AppError extends Error implements AppErrorInterface {
  public status: errorStatus;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = this.statusCode.toString().startsWith("4") ? "Fail" : "Error";
    Error.captureStackTrace(this, this.constructor);
  }
}
