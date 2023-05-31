import { NextFunction, Request, Response } from "express";
import catchAsync from "../shared/utils/catchAsync.util";
import Accommodation from "../models/accommodation.model";
import AppError from "../shared/utils/AppError.util";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import { AccommodationInterface } from "../shared/interfaces";


export const getAllAccommodations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accommodations = await Accommodation.find();

    if (!accommodations) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      results: accommodations.length,
      data: {
        accommodations,
      },
    });
  }
);
export const createAccommodations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.tourId) req.body.tours = req.params.tourId;
    const accommodation = await Accommodation.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        accommodation,
      },
    });
  }
);
export const getAccommodations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const accommodation = await Accommodation.findById(id).populate([
      { path: "reviews", select: "-__v" },
      { path: "tours", select: "name" },
    ]);

    if (!accommodation) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        accommodation,
      },
    });
  }
);
export const updateAccommodation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const accommodation =
      await Accommodation.findByIdAndUpdate<AccommodationInterface>(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!accommodation) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        accommodation,
      },
    });
  }
);

export const deleteAccommodation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const accommodation = await Accommodation.findByIdAndDelete(id);

    if (!accommodation) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Le document comportant l'ID ${id} a bien été supprimé.`,
    });
  }
);
