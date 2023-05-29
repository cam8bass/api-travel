import { Router } from "express";
import * as tourController from "./../controllers/tour.controller";
const router = Router();

// Mettre en place aggregate

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
