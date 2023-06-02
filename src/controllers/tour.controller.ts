import Tour from "../models/tour.model";
import * as factory from "./../controllers/factory.controller";

export const getAllTours = factory.getAll(Tour);

export const createTour = factory.createOne(Tour);

export const getTour = factory.getOne(Tour, [
  { path: "reviews", select: "-__v" },
  {
    path: "accommodations",
    select: "name ratingsAverage ratingsQuantity -tours",
  },
]);

export const updateTour = factory.updateOne(Tour);

export const deleteTour = factory.deleteOne(Tour);
