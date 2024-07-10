import { Router } from "express";
import * as tourController from "./../controllers/tour.controller";
import { restrictTo } from "../controllers/auth.controller";
import reviewRouter from "./review.routes";

const router = Router();

// AGGREGATE
router.get("/tourByMonth", tourController.getTourByMonth);
router.get(
  "/tourByGuidesByYears",
  tourController.getTourByGuidesByMonth
);
router.get("/getDistancePerItinerary", tourController.getDistancePerItinerary);
router.get("/getMostPopularTours", tourController.getMostPopularTours);
router.get("/getTopToursByRating", tourController.getTopToursByRating);
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
