import { Response, Request, NextFunction } from "express";
import catchAsync from "../shared/utils/catchAsync.util";
import { Model, PopulateOptions, Types } from "mongoose";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import AppError from "../shared/utils/AppError.util";
import {
  AccommodationInterface,
  ReviewInterface,
  TourInterface,
  UserInterface,
} from "../shared/interfaces";
import { bodyFilter } from "../shared/utils/bodyFilter";
import CacheManager from "../cache";
import QueryFilterCache from "../shared/utils/QueryFilterCache";

/**
 * Retrieves all documents of a given model from the database or cache. If a query is present in the request,
 * it filters the results accordingly. This function supports caching to improve performance by reducing database queries.
 *
 * @template T - A generic type that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface.
 * @param {Model<T>} Model - The Mongoose model representing the collection from which documents are retrieved.
 * @returns The catchAsync function wrapping an asynchronous function that handles the request. The wrapped function
 *          fetches all documents (or filtered documents based on the request query) and sends them in the response.
 *          If no documents are found, it sends a 404 error using the AppError utility. It leverages caching to store
 *          and retrieve results for subsequent requests.
 */
export const getAll = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let data: T[] | [] = [];
    data = CacheManager.get(Model) as T[];

    if (!data) {
      data = await Model.find().lean();
      if (!data) {
        return next(new AppError(EMPTY_RESULT, 404));
      }
      CacheManager.set(Model, data);
    }

    // Checks if there is a query in the request and filters the data accordingly.
    if (Object.entries(req.query).length) {
      const filteredQuery = new QueryFilterCache(req.query, data)
        .filter()
        .field()
        .sort()
        .page();
      // Returns the filtered cache data
      data = filteredQuery.data;
    }

    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });

/**
 * Retrieves a single document by its ID from the database or cache. If the document is not found in the cache,
 * it queries the database. Optionally, it can populate references to other documents. This function aims to
 * improve performance by utilizing caching for frequently accessed documents.
 *
 * @template T - A generic type that extends from UserInterface, TourInterface, AccommodationInterface, or ReviewInterface.
 * @param {Model<T>} Model - The Mongoose model representing the collection from which the document is retrieved.
 * @param {PopulateOptions[] | PopulateOptions} [popOptions] - Optional Mongoose population options to resolve references to other documents.
 * @returns The catchAsync function wrapping an asynchronous function that handles the request. The wrapped function
 *          attempts to retrieve the document from the cache before querying the database. If the document is found,
 *          it is returned in the response with a 200 status code. If the document is not found, a 404 error is sent
 *          using the AppError utility.
 */
export const getOne = <
  T extends
    | UserInterface
    | TourInterface
    | AccommodationInterface
    | ReviewInterface
>(
  Model: Model<T>,
  popOptions?: PopulateOptions[] | PopulateOptions
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = new Types.ObjectId(req.params.id); // Converts the request parameter id to a MongoDB ObjectId.

    let data: T | null = null; // Initializes the data variable to hold the document.

    data = CacheManager.get(Model, id) as T; // Attempts to retrieve the document from the cache.

    if (!data) {
      // If the document is not found in the cache, query the database.
      data = (await Model.findById(id).populate(popOptions).lean()) as T; // Populates document references if popOptions are provided.

      if (!data) {
        // If the document is not found in the database, return a 404 error.
        return next(new AppError(EMPTY_RESULT, 404));
      }

      CacheManager.set(Model, data, id); // Stores the retrieved document in the cache.
    }

    res.status(200).json({
      status: "success",
      data,
    }); // Sends the retrieved document in the response.
  });

/**
 * Deletes a single document by its ID from the database. This function is generic and can be used with any model
 * that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface. It leverages Mongoose's
 * findByIdAndDelete method to remove the document from the database. If the document is successfully deleted, it
 * responds with a success message. If no document is found with the provided ID, it sends a 404 error using the
 * AppError utility.
 *
 * @template T - A generic type that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface.
 * @param {Model<T>} Model - The Mongoose model representing the collection from which the document will be deleted.
 * @returns The catchAsync function wrapping an asynchronous function that handles the request. The wrapped function
 *          attempts to delete the document by ID and responds accordingly. If the document is not found, a 404 error
 *          is sent using the AppError utility.
 */
export const deleteOne = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id; // Extracts the document ID from the request parameters.
    const data = await Model.findByIdAndDelete(id).select("_id").lean(); // Attempts to delete the document by ID and selects only its ID.

    if (!data) {
      // If no document is found (and thus not deleted), it sends a 404 error.
      return next(new AppError(EMPTY_RESULT, 404));
    }

    // If the document is successfully deleted, it responds with a success message.
    res.status(200).json({
      status: "success",
      message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
    });
  });

// TODO: Voir pour mettre en place la modification du cache
/**
 * Updates a single document by its ID in the database. This function is generic and can be used with any model
 * that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface. It allows for partial
 * updates by accepting a list of fields that can be updated. This ensures that only specified fields in the request
 * body are considered for the update, enhancing security and control over the data.
 *
 * @template T - A generic type that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface.
 * @param {Model<T>} Model - The Mongoose model representing the collection from which the document will be updated.
 * @param {...(keyof T)[]} fields - A rest parameter specifying the fields that are allowed to be updated. This helps in filtering the request body to only include the specified fields.
 * @returns The catchAsync function wrapping an asynchronous function that handles the request. The wrapped function
 *          attempts to update the document by ID with the filtered body and responds accordingly. If the document is
 *          not found, a 404 error is sent using the AppError utility. If the update is successful, the updated document
 *          is returned in the response with a 200 status code.
 */
export const updateOne = <
  T extends
    | UserInterface
    | TourInterface
    | AccommodationInterface
    | ReviewInterface
>(
  Model: Model<T>,
  ...fields: (keyof T)[]
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id; // Extracts the document ID from the request parameters.

    const filteredBody = bodyFilter(req.body, ...fields); // Filters the request body to only include the specified fields.

    const data = await Model.findByIdAndUpdate(id, filteredBody, {
      new: true, // Returns the updated document instead of the original.
      runValidators: true, // Ensures that updates adhere to the model's validation rules.
    }).lean(); // Converts the MongoDB document to a plain JavaScript object.

    if (!data) {
      // If no document is found (and thus not updated), it sends a 404 error.
      return next(new AppError(EMPTY_RESULT, 404));
    }

    // If the document is successfully updated, it responds with the updated document.
    res.status(200).json({
      status: "success",
      data,
    });
  });

/**
 * Creates a new document in the database based on the model provided. This function is generic and can be used with any model
 * that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface. It leverages the Mongoose `create` method
 * to insert a new document into the database using the data provided in the request body.
 *
 * @template T - A generic type that extends from UserInterface, TourInterface, ReviewInterface, or AccommodationInterface.
 * @param {Model<T>} Model - The Mongoose model representing the collection into which the new document will be inserted.
 * @returns The catchAsync function wrapping an asynchronous function that handles the request. The wrapped function
 *          creates a new document using the request body and responds with the created document and a 201 status code.
 *          If an error occurs during document creation, it is caught by the catchAsync utility, which then passes the error
 *          to the next middleware for error handling.
 */
export const createOne = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  });
