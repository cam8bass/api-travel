import { ObjectId } from "mongoose";
import { Document } from "mongoose";
import { difficultyType } from "../types/types";

export interface TourInterface extends Document {
  name: string;
  summary: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  ratingsQuantity: number;
  ratingsAverage: number;
  difficulty: difficultyType;
  createAt: Date;
  imageCover: {
    url: string;
    alt: string;
  };
  startDates: [Date];
  images: [
    {
      url: string;
      alt: string;
    }
  ];
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
