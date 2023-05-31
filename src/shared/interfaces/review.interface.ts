import { ObjectId, Document } from "mongoose";

export interface ReviewInterface extends Document {
  review: string;
  rating: number;
  user: ObjectId;
  tour?: ObjectId;
  accommodation?: ObjectId;
}
