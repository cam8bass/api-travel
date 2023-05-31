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
        30,
        "Le champ nom de l'hébergement ne peut pas dépasser 30 caractères.",
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
        600,
        "Le champ description ne peut pas dépasser 600 caractères",
      ],
      required: [true, "Le champ description est obligatoire"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
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

    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinate: [Number],
      address: {
        type: String,
        minlength: [
          5,
          "Le champ adresse doit contenir au minimum 5 caractères",
        ],
        max: [30, "Le champ adresse doit contenir au maximum 30 caractères"],
        trim: true,
        lowercase: true,
      },
      city: {
        type: String,
        minlength: [2, "Le champ ville doit contenir au minimum 2 caractères"],
        maxlength: [
          30,
          "Le champ ville doit contenir au maximum 30 caractères",
        ],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        minlength: [
          12,
          "Le champ 'numéro de téléphone' doit contenir au minimum 12 caractères et être présenté sous la forme suivante : 000-000-0000.",
        ],
        maxlength: [
          12,
          "Le champ 'numéro de téléphone' doit contenir au maximum 12 caractères et être présenté sous la forme suivante : 000-000-0000.",
        ],
        trim: true,
        lowercase: true,
      },
    },
    tours: {
      type: [Schema.Types.ObjectId],
      ref: "Tour",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accommodationSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "accommodation",
  localField: "_id",
});

const Accommodation = model<AccommodationInterface>(
  "Accommodation",
  accommodationSchema
);

export default Accommodation;
