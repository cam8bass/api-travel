import { NextFunction, Request, Response } from "express";
import catchAsync from "./catchAsync.util";
import { Types } from "mongoose";
import AppError from "./AppError.util";
import validator from "validator";
import {
  sendRequestDataInterface,
  sendRequestHttpInterface,
  sendRequestResponseInterface,
} from "../interfaces";
import { IsURLOptions } from "validator/lib/isURL";

/**
 * Validates the HTTP request details.
 *
 * This function checks if the provided HTTP request details contain a valid URL and a valid HTTP method.
 * If any of these validations fail, it triggers the next middleware with an appropriate error message.
 *
 * @param {sendRequestHttpInterface} http - The HTTP request details to validate.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware.
 */
const checkSendRequestHttp = (
  http: sendRequestHttpInterface,
  next: NextFunction
) => {
  const { NODE_ENV } = process.env;

  const validatorOption: IsURLOptions = {
    require_tld: NODE_ENV !== "development",
  };

  // Validate the URL
  if (!http.url || !validator.isURL(http.url, validatorOption)) {
    return next(new AppError("Veuillez entrer un url valide", 400));
  }

  // Validate the HTTP method
  if (!["GET", "POST", "PATCH", "DELETE"].includes(http.method)) {
    return next(new AppError("Veuillez entrer une methode http valide", 400));
  }
};

/**
 * Validates the API key and ID details in the request data.
 *
 * This function checks if the provided data contains a valid API key and a valid API ID.
 * The API key is validated using a UUID format check, and the API ID is validated
 * by checking if it is a valid MongoDB ObjectId. If any of these validations fail,
 * it triggers the next middleware with an appropriate error message.
 *
 * @param {sendRequestDataInterface} data - The request data containing the API key and ID to validate.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware.
 */
const checkSendRequestData = (
  data: sendRequestDataInterface,
  next: NextFunction
) => {
  if (!data.apiKey || !validator.isUUID(data.apiKey)) {
    return next(new AppError("Veuillez entrer une clé d'api valide", 400));
  }

  if (!data.idApiKey || !Types.ObjectId.isValid(data.idApiKey)) {
    return next(new AppError("Veuillez entrer un id d'api valide", 400));
  }
};

/**
 * Sets up a request timeout using an AbortController.
 *
 * This function creates an AbortController instance and a timeout using `setTimeout`.
 * If the timeout is reached before the request is completed, the request is aborted.
 *
 * @returns An object containing the `AbortController` instance and the `timeoutId` of the timeout.
 * The `AbortController` can be used to abort the HTTP request, and the `timeoutId` can be used
 * to clear the timeout if the request completes before the timeout period.
 */
const setupRequestTimeout = (): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  return { controller, timeoutId };
};

/**
 * Sends an HTTP request using the Fetch API with custom headers and abort functionality.
 *
 * This function constructs a request configuration object, including the HTTP method, custom headers
 * containing API key details, and an abort signal from an `AbortController`. It then sends an HTTP
 * request to the specified URL using the Fetch API. If the request takes too long and is aborted,
 * the Fetch API will throw an `AbortError`.
 *
 * @param {sendRequestHttpInterface} http - An object containing the URL and the HTTP method for the request.
 * @param {sendRequestDataInterface} data - An object containing the API key and API key ID to be sent as headers.
 * @param {AbortController} controller - An `AbortController` instance used to abort the request if it exceeds a timeout.
 * @returns {Promise<Response>} A promise that resolves with the response to the HTTP request.
 */
const sendHttpRequest = async (
  http: sendRequestHttpInterface,
  data: sendRequestDataInterface,
  controller: AbortController
) => {
  const ajaxConfig: RequestInit = {
    method: http.method || "GET",
    headers: {
      "x-api-key": data.apiKey,
      "x-api-key-id": data.idApiKey,
    },
    signal: controller.signal,
  };
  return await fetch(http.url, ajaxConfig);
};

/**
 * Processes the HTTP response from a fetch request.
 *
 * This function checks if the response from the fetch request was successful (status code 200-299).
 * If the response was not successful, it triggers the next middleware with an appropriate error message
 * and the status code from the response. If the response was successful, it parses the response body as JSON
 * and returns it.
 *
 * @param {globalThis.Response} ajax - The response object from the fetch request.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware in case of an error.
 * @returns {Promise<sendRequestResponseInterface>} A promise that resolves with the parsed JSON response if the request was successful.
 */
const processResponse = async (
  ajax: globalThis.Response,
  next: NextFunction
): Promise<sendRequestResponseInterface | void> => {
  if (!ajax.ok)
    return next(
      new AppError(
        "Une erreur est survenue lors de l'envoi de la requête",
        ajax.status
      )
    );
  return (await ajax.json()) as sendRequestResponseInterface;
};

/**
 * Sends an HTTP request with validation, timeout, and error handling.
 *
 * This function first validates the provided API key, ID, URL, and HTTP method. If any validation fails,
 * it immediately triggers the next middleware with an appropriate error message. It then sets up a request
 * timeout using an `AbortController`. The HTTP request is sent using the Fetch API, and the response is processed.
 * If the request is successful, the response is returned. In case of a request timeout or any other error,
 * the appropriate error message is passed to the next middleware.
 *
 * @param {sendRequestHttpInterface} http - An object containing the URL and the HTTP method for the request.
 * @param {sendRequestDataInterface} data - An object containing the API key and API key ID to be sent as headers.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware in case of an error.
 * @returns {Promise<sendRequestResponseInterface | void>} A promise that resolves with the parsed JSON response if the request was successful, or void if an error occurred.
 */
export const sendRequest = async (
  http: sendRequestHttpInterface,
  data: sendRequestDataInterface,
  next: NextFunction
): Promise<sendRequestResponseInterface | void> => {
  // Validate API key and ID
  checkSendRequestData(data, next);
  // Validate URL and HTTP method
  checkSendRequestHttp(http, next);
  // Setup request timeout
  const { controller, timeoutId } = setupRequestTimeout();

  try {
    // Send the HTTP request
    const ajax = await sendHttpRequest(http, data, controller);
    // Clear the timeout if the request was successful
    clearTimeout(timeoutId);
    // Process the response
    const response = await processResponse(ajax, next);
    // Return the response if everything was successful
    return response;
  } catch (error) {
    // Ensure the timeout is cleared on error
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      // Handle request timeout error
      return next(new AppError("La requête a expiré", 408));
    } else {
      // Handle other errors
      return next(
        new AppError(
          error.message || "Une erreur est survenue lors de la requête",
          500
        )
      );
    }
  }
};
