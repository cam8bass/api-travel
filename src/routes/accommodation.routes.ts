import { Router } from "express";
import * as accommodationController from "./../controllers/accommodation.controller";
import { restrictTo } from "../controllers/auth.controller";
import reviewRouter from "./review.routes";

const router = Router();

router
  .route("/")
  .get(accommodationController.getAllAccommodations)
  .post(restrictTo("admin"), accommodationController.createAccommodations);

router
  .route("/:id")
  .get(accommodationController.getAccommodations)
  .patch(restrictTo("admin"), accommodationController.updateAccommodation)
  .delete(restrictTo("admin"), accommodationController.deleteAccommodation);

// NESTED ROUTES
router.use("/:accommodationId/reviews", reviewRouter);

export default router;
