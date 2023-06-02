import { Schema, model } from "mongoose";
import { ReviewInterface } from "../shared/interfaces";

const reviewSchema = new Schema<ReviewInterface>(
  {
    review: {
      type: String,
      minlength: [
        10,
        "Le champ commentaire doit contenir au minimum 10 caractères",
      ],
      maxlength: [
        300,
        "Le champ commentaire doit contenir au maximum 300 caractères",
      ],
      trim: true,
      required: [true, "Le champ commentaire est obligatoire"],
    },
    rating: {
      type: Number,
      min: [0, "La note doit être supérieur ou égale à 0"],
      max: [5, "La note doit être inférieur ou égale à 5"],
      trim: true,
      required: [true, "Le champ note est obligatoire"],
    },
    // REF
    accommodation: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Le champ utilisateur est obligatoire"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/,function(next){
  this.populate({
    path:"user",
    select:"pseudo"
  })
  next()
})

const Review = model<ReviewInterface>("Review", reviewSchema);

export default Review;
