import path from "path";
import { ObjectId, Schema, model } from "mongoose";
import { TourInterface } from "../shared/interfaces";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
const tourSchema = new Schema<TourInterface>(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "Le champ nom doit contenir au minimum 3 caractères"],
      maxlength: [30, "Le champ nom doit contenir au maximum 30 caractères"],
      required: [true, "Le champ nom est obligatoire"],
      set: (value: string) => sanitizeHtml(value),
    },
    summary: {
      type: String,
      trim: true,
      minlength: [20, "Le champ résumé doit contenir au minimum 20 caractères"],
      maxlength: [
        300,
        "Le champ résumé doit contenir au maximum 300 caractères",
      ],
      required: [true, "Le champ résumé est obligatoire"],
      set: (value: string) => sanitizeHtml(value),
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        200,
        "Le champ description doit contenir au minimum 200 caractères",
      ],
      maxlength: [
        800,
        "Le champ description doit contenir au maximum 800 caractères",
      ],
      required: [true, "Le champ description est obligatoire"],
      set: (value: string) => sanitizeHtml(value),
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
    ratingsQuantity: {
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
      set: (value: string) => validator.escape(value),
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
      set: (value: [string]) => value.map((name) => sanitizeHtml(name)),
      validate: {
        validator: function (this: TourInterface) {
          const validExtension = [".jpg", ".jpeg", ".png", ".webp"];

          const extension = this.images.map((el) => {
            return path.extname(el).toLowerCase();
          });

          if (extension.every((ext) => validExtension.includes(ext))) {
            return true;
          }
          return false;
        },
        message:
          "Les formats d'image utilisables sont le JPG, JPEG, PNG et WebP.",
      },
    },

    itinerary: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinate: [Number],
        day: {
          type: Number,
          min: [1, "Le jour minimum est 1"],
          max: [365, "Le jour maximum est 365"],
          trim: true,
          required: [true, "Le jour est obligatoire"],
        },
        title: {
          type: String,
          trim: true,
          lowercase: true,
          required: [true, "Le titre de l'itinéraire est obligatoire"],
          minlength: [
            3,
            "Le titre de l'itinéraire doit comporter au minimum 3 caractères",
          ],
          maxlength: [
            50,
            "Le titre de l'itinéraire doit comporter au maximum 50 caractères",
          ],
          set: (value: string) => sanitizeHtml(value),
        },
        description: {
          type: String,
          trim: true,
          minlength: [
            20,
            "Le champ description de l'itinéraire doit contenir au minimum 20 caractères",
          ],
          maxlength: [
            600,
            "Le champ description de l'itinéraire doit contenir au maximum 600 caractères",
          ],
          required: [
            true,
            "Le champ description de l'itinéraire est obligatoire",
          ],
          set: (value: string) => sanitizeHtml(value),
        },
      },
    ],
    // REF
    guides: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.virtual("accommodations", {
  ref: "Accommodation",
  foreignField: "tours",
  localField: "_id",
});

const Tour = model<TourInterface>("Tour", tourSchema);

export default Tour;
