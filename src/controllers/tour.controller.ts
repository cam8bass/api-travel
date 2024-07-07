import { NextFunction, Request, Response } from "express";
import Tour from "../models/tour.model";
import catchAsync from "../shared/utils/catchAsync.util";
import * as factory from "./../controllers/factory.controller";
import AppError from "../shared/utils/AppError.util";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import { TourInterface } from "../shared/interfaces";

// AGGREGATE
export const getTourByMonth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const years = req.params.years;

    const tours = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${years}-01-01`),
            $lte: new Date(`${years}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          totalToursPerMonth: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    if (tours.length === 0) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);
export const getTourByGuidesByMonth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const years = req.params.years;
    const tours = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $unwind: "$guides",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${years}-01-01`),
            $lte: new Date(`${years}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: "$guides",
          totalTours: { $sum: 1 },
          destinations: {
            $push: {
              name: "$name",
              startDate: "$startDates",
            },
          },
        },
      },
      {
        $addFields: { guide: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { totalTours: 1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);

export const getDistancePerItinerary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @function getMostPopularTours
 * @description Retrieves the most popular tour based on a calculated popularity score.
 * The popularity score is determined by multiplying the average rating by the number of ratings.
 * The tour with the highest popularity score is returned.
 *
 * @param {Request} req - The request object from the client.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @returns {void} Sends a JSON response containing the most popular tour.
 */
export const getMostPopularTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.aggregate([
      {
        $addFields: {
          popularityScore: {
            $multiply: ["$ratingsAverage", "$ratingsQuantity"],
          },
        },
      },
      {
        $sort: { popularityScore: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        tour: tours[0],
      },
    });
  }
);

/**
 * @function getTop10ToursByRating
 * @description Retrieves the top 10 tours based on their average ratings.
 * The tours are sorted in descending order of their ratings and limited to the top 10.
 *
 * @param {Request} req - The request object from the client.
 * @param {Response} res - The response object to send data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @returns {void} Sends a JSON response containing the top 10 tours by rating.
 */
export const getTop10ToursByRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find().sort({ ratingsAverage: -1 }).limit(10);

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  }
);

// CRUD
export const getAllTours = factory.getAll(Tour);
export const createTour = factory.createOne(Tour);
export const getTour = factory.getOne(Tour, [
  { path: "reviews", select: "-__v" },
  {
    path: "accommodations",
    select: "name ratingsAverage ratingsQuantity -tours",
  },
  {
    path: "guides",
    select: "firstname lastname photo",
  },
]);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);
