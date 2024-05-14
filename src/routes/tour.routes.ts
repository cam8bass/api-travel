import { Router } from "express";
import * as tourController from "./../controllers/tour.controller";
import { restrictTo } from "../controllers/auth.controller";
import reviewRouter from "./review.routes";

const router = Router();

// AGGREGATE
router.get("/tourByMonth/:years", tourController.getTourByMonth);
router.get(
  "/tourByGuidesByYears/:years",
  tourController.getTourByGuidesByMonth
);
router.get("/getDistancePerItinerary", tourController.getDistancePerItinerary);

// ROUTES
router
  .route("/")
  .get(tourController.getAllTours)
  .post(restrictTo("admin"), tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(restrictTo("admin"), tourController.updateTour)
  .delete(restrictTo("admin"), tourController.deleteTour);

// NESTED ROUTES
router.use("/:tourId/reviews", reviewRouter);

export default router;
