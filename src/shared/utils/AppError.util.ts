import { AppErrorInterface } from "../interfaces";
import { errorStatus } from "../types/types";

/**
 * Represents a custom error class extending the native Error class, implementing the AppErrorInterface.
 * This class is designed to handle application-specific errors, providing additional properties
 * to distinguish between operational errors and programming errors.
 */
export default class AppError extends Error implements AppErrorInterface {
  public status: errorStatus; // Indicates the error status as either 'Fail' for client-side errors or 'Error' for server-side errors.
  public statusCode: number; // The HTTP status code associated with the error.
  public isOperational: boolean; // A flag indicating whether the error is an operational error, which is expected and handled within the application.

  /**
   * Constructs an instance of the AppError class.
   * @param message The error message that describes the error.
   * @param statusCode The HTTP status code that corresponds to the type of error.
   */
  constructor(message: string, statusCode: number) {
    super(message); // Calls the constructor of the base Error class with the provided message.
    this.statusCode = statusCode; // Sets the HTTP status code for the error.
    this.isOperational = true; // Marks the error as an operational error by default.
    // Determines the error status based on the status code: 'Fail' for client errors (4xx), 'Error' for server errors (5xx).
    this.status = this.statusCode.toString().startsWith("4") ? "Fail" : "Error";
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace to exclude the constructor call from it.
  }
}
