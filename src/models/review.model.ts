import { Schema, model } from "mongoose";
import { ReviewInterface } from "../shared/interfaces";
import sanitizeHtml from "sanitize-html";

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
      set: (value: string) => sanitizeHtml(value),
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/**
 * Pre-find middleware that populates the user field and excludes the version key from the result.
 * This function is called before any find operation on the Review model.
 * It automatically populates the 'user' field with the 'pseudo' of the user,
 * and excludes the MongoDB version key (__v) from the query results.
 *
 * @param next - The next middleware function in the stack.
 */
reviewSchema.pre(/^find/, function (next) {
  // Populates the 'user' field with the 'pseudo' property of the user document.
  this.populate({
    path: "user",
    select: "pseudo",
  });

  this.select("-__v");
  next();
});

const Review = model<ReviewInterface>("Review", reviewSchema);

export default Review;
