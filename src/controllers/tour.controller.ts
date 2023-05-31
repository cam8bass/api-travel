import { NextFunction, Request, RequestHandler, Response } from "express";
import Tour from "../models/tour.model";
import catchAsync from "../shared/utils/catchAsync.util";
import AppError from "../shared/utils/AppError.util";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import QueryFilter from "../shared/utils/QueryFilter.util";
import { bodyFilter } from "../shared/utils/bodyFilter";
import { TourInterface } from "../shared/interfaces";

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filteredQuery = new QueryFilter(Tour.find(), req.query)
      .filter()
      .sort()
      .field()
      .page();

    const tours = await filteredQuery.query;

    if (!tours) {
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

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  }
);

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await Tour.findById(id).populate([
      { path: "reviews", select: "-__v" },
      {
        path: "accommodations",
        select: "name ratingsAverage ratingsQuantity -tours",
      },
    ]);

    if (!tour) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
    });
  }
);
