import { Router } from "express";
import * as reviewController from "./../controllers/review.controller";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    reviewController.selectReviewForTourOrAccommodation,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
