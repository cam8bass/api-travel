import path from "path";
import { Schema, model } from "mongoose";
import { TourInterface } from "../shared/interfaces";

const tourSchema = new Schema<TourInterface>(
  {
    title: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "Le champ titre doit contenir au minimum 3 caractères"],
      maxlength: [20, "Le champ titre doit contenir au maximum 20 caractères"],
      required: [true, "Le champ titre est obligatoire"],
      unique: true,
    },
    summary: {
      type: String,
      trim: true,
      minlength: [20, "Le champ résumé doit contenir au minimum 20 caractères"],
      maxlength: [
        200,
        "Le champ résumé doit contenir au maximum 200 caractères",
      ],
      required: [true, "Le champ résumé est obligatoire"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        200,
        "Le champ description doit contenir au minimum 200 caractères",
      ],
      maxlength: [
        600,
        "Le champ description doit contenir au maximum 600 caractères",
      ],
      required: [true, "Le champ description est obligatoire"],
    },
    price: {
      type: Number,
      trim: true,
      min: [1, "Le prix doit être supérieur à 0"],
      max: [99999, "Le prix doit être inférieur à 99999"],
      required: [true, "Le champ prix est obligatoire"],
    },
    duration: {
      type: Number,
      trim: true,
      min: [0, "La durée doit être supérieur à 0 jour"],
      max: [365, "La durée doit être supérieur à 365 jours"],
      required: [true, "La durée est obligatoire"],
    },
    maxGroupSize: {
      type: Number,
      trim: true,
      min: [1, "La taille du groupe doit être supérieur à 1"],
      max: [100, "La taille du groupe doit être inférieur à 100"],
      required: [true, "La taille du groupe est obligatoire"],
    },
    ratingsAverage: {
      type: Number,
      trim: true,
      min: [
        0,
        "Le champ note moyenne des commentaires doit être supérieur ou égal à 0",
      ],
      max: [
        5,
        "Le champ note moyenne des commentaires doit être inférieur ou égal à 5",
      ],
      default: 4.5,
    },
    ratingsQuantiy: {
      type: Number,
      trim: true,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    imageCover: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: TourInterface) {
          const validExtension = [".jpg", ".jpeg", ".png", ".webp"];
          const extension = path.extname(this.imageCover).toLowerCase();
          if (validExtension.includes(extension)) {
            return true;
          }
          return false;
        },
        message:
          "Les formats d'image utilisables sont le JPG, JPEG, PNG et WebP.",
      },
    },
    startDates: {
      type: [Date],
      trim: true,
      required: [true, "Le champ dates de départ est obligatoire"],
    },
    images: {
      type: [String],
      trim: true,
      validate: {
        validator: function (this: TourInterface) {
          const validExtension = [".jpg", ".jpeg", ".png", ".webp"];
          const extension = this.images.map((el) =>
            path.extname(el).toLowerCase()
          );

          if (extension.every((ext) => validExtension.includes(ext))) {
            return true;
          }
          return false;
        },
        message:
          "Les formats d'image utilisables sont le JPG, JPEG, PNG et WebP.",
      },
    },
    // guides: {},
    // startLocation: {},
    // itinary: {},
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tour = model<TourInterface>("Tour", tourSchema);

export default Tour;
