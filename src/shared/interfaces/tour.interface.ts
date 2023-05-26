import { ObjectId } from "mongoose";
import { difficulty, transport } from "../types/types";

export interface TourInterface {
  title: string;
  summary: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  ratingsQuantiy: number;
  ratingsAverage: number;
  createAt: Date;
  imageCover: string;
  startDates: [Date];
  images: [string];
  // guides: [ObjectId];
  // startLocation: {
  //   type: string;
  //   coordinate: [number];
  //   address: string;
  //   city: string;
  //   summary: string;
  //   description: string;
  //   accommodation: ObjectId;
  // };
  // itinary: {
  //   type: string;
  //   coordinate: [number];
  //   address: string;
  //   city: string;
  //   summary: string;
  //   description: string;
  //   accommodation: ObjectId;
  //   day: number;
  //   transport: transport;
  //   activities: {
  //     type: string;
  //     images: [string];
  //     description: string;
  //     summary: string;
  //     difficulty: difficulty;
  //     transport: transport;
  //   };
  // };
}
