import { Router } from "express";
import * as accommodationController from "./../controllers/accommodation.controller";

import reviewRouter from "./review.routes";

const router = Router();

// Mettre en place aggregate

router
  .route("/")
  .get(accommodationController.getAllAccommodations)
  .post(accommodationController.createAccommodations);

router
  .route("/:id")
  .get(accommodationController.getAccommodations)
  .patch(accommodationController.updateAccommodation)
  .delete(accommodationController.deleteAccommodation);

// NESTED ROUTES
router.use("/:accommodationId/reviews", reviewRouter);
export default router;
