import { Document, ObjectId } from "mongoose";

export interface AccommodationInterface extends Document {
  name: string;
  description: string;
  services: [string];
  images: [string];
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  tours: [ObjectId];
  createAt: Date;
  // reviews: [ObjectId];
  // location: {
  //   type: string;
  //   coordinate: [number];
  //   city: string;
  //   address: string;
  // };
}
