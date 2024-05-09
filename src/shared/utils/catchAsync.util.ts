import { NextFunction, Request, Response } from "express";

/**
 * Wraps an asynchronous function, automatically catching any errors and passing them to the next middleware.
 * This function is designed to be used with Express route handlers or middleware that return Promises.
 *
 * @param fn - An asynchronous function that takes Express's `req`, `res`, and `next` parameters.
 *             It should return a Promise.
 * @returns A function that takes Express's `req`, `res`, and `next` parameters. When invoked, it calls
 *          `fn` with these parameters and catches any errors, passing them to `next`.
 */
export default (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
