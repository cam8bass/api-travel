import Accommodation from "../models/accommodation.model";
import * as factory from "./../controllers/factory.controller";

export const getAllAccommodations = factory.getAll(Accommodation);

export const createAccommodations = factory.createOne(Accommodation);

export const getAccommodations = factory.getOne(Accommodation, [
  { path: "reviews", select: "-__v" },
  { path: "tours", select: "name" },
]);

export const updateAccommodation = factory.updateOne(Accommodation);

export const deleteAccommodation = factory.deleteOne(Accommodation);
