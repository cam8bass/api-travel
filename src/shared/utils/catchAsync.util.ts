import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express";

/**
 * Wraps an asynchronous function, ensuring that any uncaught errors are passed to the next middleware in the chain.
 *
 * @param fn - An asynchronous function that takes Express's `req`, `res`, and `next` parameters. It should return a Promise.
 * @returns A RequestHandler that executes the provided asynchronous function and catches any errors, passing them to the next middleware.
 */
export default (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
