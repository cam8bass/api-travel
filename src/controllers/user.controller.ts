import User from "../models/user.model";

import * as factory from "./../controllers/factory.controller";

export const getAllUsers = factory.getAll(User);

export const createUser = factory.createOne(User);

export const getUser = factory.getOne(User);

export const updateUser = factory.updateOne(
  User,
  "firstname",
  "lastname",
  "pseudo"
);

export const deleteUser = factory.deleteOne(User);
