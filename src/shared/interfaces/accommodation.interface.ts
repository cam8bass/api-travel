import { Document, ObjectId } from "mongoose";

export interface AccommodationInterface extends Document {
  name: string;
  description: string;
  services: [string];
  ratingsAverage: number;
  ratingsQuantity: number;
  createAt: Date;
  location: {
    type: string;
    coordinate: [number];
    address: string;
    phone: string;
    city: string;
  };
  tours: [ObjectId];
}
