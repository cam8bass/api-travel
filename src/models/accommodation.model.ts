import path from "path";
import { Schema, model } from "mongoose";
import { AccommodationInterface } from "../shared/interfaces";

const accommodationSchema = new Schema<AccommodationInterface>(
  {
    name: {
      type: String,
      minlength: [
        3,
        "Le champ nom de l'hébergement doit comporter au moins 3 caractères.",
      ],
      maxlength: [
        20,
        "Le champ nom de l'hébergement ne peut pas dépasser 20 caractères.",
      ],
      trim: true,
      lowercase: true,
      required: [true, "Le champ nom de l'hébergement est obligatoire"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        50,
        "Le champ description doit comporter au moins 50 caractères",
      ],
      maxlength: [
        300,
        "Le champ description ne peut pas dépasser 300 caractères",
      ],
      required: [true, "Le champ description est obligatoire"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    imageCover: {
      type: String,
      required: [true, "Le champ image de couverture est obligatoire"],
      validate: {
        validator: function (this: AccommodationInterface) {
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
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      trim: true,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      trim: true,
      default: 0,
    },
    services: {
      type: [String],
      trim: true,
      required: [true, "Le champ services est obligatoire"],
    },
    images: {
      type: [String],
      trim: true,
      validate: {
        validator: function (this: AccommodationInterface) {
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
    tours: {
      type: [Schema.Types.ObjectId],
      ref: "Tour",
      required: [true, "Le champ voyage est obligatoire"],
    },
    // reviews: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Review",
    // },
    // location: {
    //   type: "Point",
    //   coordinate: [Number],
    //   city: String,
    //   address: String,
    //   trim: true,
    //   lowercase: true,
    //   required: [true, "Le champ emplacement est obligatoire"],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Accommodation = model<AccommodationInterface>(
  "Accommodation",
  accommodationSchema
);

export default Accommodation;
