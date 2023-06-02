import Review from "../models/review.model";
import { NextFunction, Request } from "express";

import * as factory from "./../controllers/factory.controller";

export const selectReviewForTourOrAccommodation = async (
  req: Request,
  _: never,
  next: NextFunction
) => {
  if (req.params.tourId) req.body.tour = req.params.tourId;
  if (req.params.accommodationId)
    req.body.accommodation = req.params.accommodationId;

  next();
};

export const getAllReviews = factory.getAll(Review);

export const createReview = factory.createOne(Review);

export const getReview = factory.getOne(Review, {
  path: "tour",
  select: "name",
});

export const updateReview = factory.updateOne(Review, "review", "rating");

export const deleteReview = factory.deleteOne(Review);
