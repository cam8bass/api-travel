import { ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface TourInterface extends Document {
  name: string;
  summary: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  ratingsQuantity: number;
  ratingsAverage: number;
  createAt: Date;
  imageCover: string;
  startDates: [Date];
  images: [string];
  guides: [ObjectId];
  itinerary: [
    {
      type: string;
      coordinate: [number];
      day: number;
      title: string;
      description: string;
    }
  ];
}
