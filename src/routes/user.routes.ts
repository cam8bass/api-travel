import { Router } from "express";
import * as userController from "./../controllers/user.controller";
import { restrictTo } from "../controllers/auth.controller";

const router = Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(restrictTo("admin"), userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(restrictTo("admin"), userController.deleteUser)
  .patch(restrictTo("admin"), userController.updateUser);

export default router;
