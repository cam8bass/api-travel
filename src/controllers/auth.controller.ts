import { NextFunction, Response, Request } from "express";
import catchAsync from "../shared/utils/catchAsync.util";
import { ERROR_ACCESS_DENIED } from "../shared/messages/error.message";
import AppError from "../shared/utils/AppError.util";
import {
  sendRequestDataInterface,
  sendRequestHttpInterface,
  sendRequestResponseInterface,
} from "../shared/interfaces";
import { sendRequest } from "../shared/utils/sendRequest.util";
import { requestHttpType } from "../shared/types/types";

type userRole = "user" | "admin";

interface CustomRequestInterface extends Request {
  role?: userRole;
}

/**
 * Retrieves the configuration for API connection based on the current environment.
 *
 * This function checks the `NODE_ENV` environment variable to determine if the application
 * is running in a development or production environment. It then selects the appropriate
 * API URL from the environment variables.
 *
 * @returns An object containing the `url` property with the API connection URL.
 */
export const getConfig = (): { url: string } => ({
  url:
    process.env.NODE_ENV === "development"
      ? process.env.URL_API_CONNECT_DEV
      : process.env.URL_API_CONNECT_PROD,
});

/**
 * Validates the presence of API credentials in the request headers.
 * This function checks if both the API key and API key ID are provided in the request headers.
 * If either is missing, it triggers an error response using the `next` function with a custom error message.
 *
 * @param apiKey - The API key extracted from the request headers.
 * @param idApiKey - The API key ID extracted from the request headers.
 * @param next - The `NextFunction` from Express, used to pass control to the next middleware or to handle errors.
 * @returns {void} - This function does not return a value. It either passes control to the next middleware or triggers an error.
 */
const validateApiCredentials = (
  apiKey: string,
  idApiKey: string,
  next: NextFunction
): void => {
  if (!apiKey) {
    return next(new AppError("Veuillez entrer une clé d'api valide", 400));
  }

  if (!idApiKey) {
    return next(new AppError("Veuillez entrer un id d'api valide", 400));
  }
};

/**
 * Middleware for authenticating API requests.
 * This middleware authenticates requests by validating API credentials provided in the request headers.
 * It uses the `sendRequest` utility to authenticate the request against an external service.
 * If authentication is successful, it attaches the user's role to the request object for use in subsequent middleware.
 * If authentication fails, it triggers an error response.
 *
 * @param req - The request object, extended to include `response` and `role` properties.
 * @param res - The response object. Not directly used in this middleware, but required by the middleware signature.
 * @param next - The next function in the middleware chain. Used to pass control to the next middleware or to handle errors.
 * @returns {Promise<void>} - This function returns a promise that resolves to void. It either passes control to the next middleware or triggers an error.
 */
export const apiAuth = catchAsync(
  async (req: CustomRequestInterface, res: Response, next: NextFunction) => {
    // Extracts the HTTP method from the request object.
    const { method } = req;
    // Retrieves the API connection configuration based on the current environment.
    const { url } = getConfig();

    // Extracts API credentials from the request headers.
    const apiKey: string = req.headers["x-api-key"] as string;
    const idApiKey: string = req.headers["x-api-key-id"] as string;
    // Validates the presence of API credentials.
    validateApiCredentials(apiKey, idApiKey, next);

    // Prepares the HTTP request configuration for the authentication request.
    const http: sendRequestHttpInterface = {
      url,
      method: method as requestHttpType,
    };

    // Prepares the data object containing the API credentials.
    const data: sendRequestDataInterface = {
      apiKey,
      idApiKey,
    };

    // Sends the authentication request and awaits the response.
    const response = (await sendRequest(
      http,
      data,
      next
    )) as sendRequestResponseInterface;

    if (!response || !response.data) {
      return next(
        new AppError(
          "Échec de l'authentification API. Aucune réponse reçue.",
          500
        )
      );
    }

    // Checks if the authentication was successful and a role was returned.
    if (!response.data.auth || !response.data.role) {
      // If authentication fails or no role is returned, triggers an error response.
      return next(new AppError(ERROR_ACCESS_DENIED, 403));
    }

    // Attaches the user's role to the request object for use in next middleware.
    req.role = response.data.role;

    // Passes control to the next middleware in the stack.
    next();
  }
);

/**
 * Middleware to restrict access to specific user roles.
 * It leverages the `catchAsync` utility to handle any asynchronous errors that may occur.
 *
 * @param {...userRole[]} userRole - A list of user roles that are allowed to access the route.
 * @returns A middleware function that checks if the user's role is included in the allowed roles.
 * If the user's role is not allowed, it responds with an "access denied" error.
 * Otherwise, it calls `next()` to pass control to the next middleware in the stack.
 */

export const restrictTo = (...userRole: userRole[]) =>
  catchAsync(
    async (req: CustomRequestInterface, res: Response, next: NextFunction) => {
      const { role } = req;
      if (!userRole.includes(role)) {
        return next(new AppError(ERROR_ACCESS_DENIED, 403));
      }

      next();
    }
  );
