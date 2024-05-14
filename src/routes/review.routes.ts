import { Router } from "express";
import * as reviewController from "./../controllers/review.controller";
import { restrictTo } from "../controllers/auth.controller";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    restrictTo("admin"),
    reviewController.selectReviewForTourOrAccommodation,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(restrictTo("admin"), reviewController.updateReview)
  .delete(restrictTo("admin"), reviewController.deleteReview);

export default router;
