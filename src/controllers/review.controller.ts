import catchAsync from "../shared/utils/catchAsync.util";
import Review from "../models/review.model";
import { NextFunction, Request, Response } from "express";
import AppError from "../shared/utils/AppError.util";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import { bodyFilter } from "../shared/utils/bodyFilter";
import { ReviewInterface } from "../shared/interfaces";

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find();

    if (!reviews) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let query: Record<string, any>;

    if (req.params.tourId) {
      req.body.tourId = req.params.tourId;
      query = Review.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tourId,
      });
    } else if (req.params.accommodationId) {
      req.body.accommodationId = req.params.accommodationId;
      query = Review.create({
        review: req.body.review,
        rating: req.body.rating,
        accommodation: req.body.accommodationId,
      });
    }

    const review = await query;

    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const review = await Review.findById(id).populate([
      { path: "tour", select: "name" },
    ]);

    if (!review) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const filteredBody = bodyFilter<ReviewInterface>(
      req.body,
      "review",
      "rating"
    );
    const review = await Review.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
    });
  }
);
