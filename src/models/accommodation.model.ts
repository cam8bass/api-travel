import { Schema, model } from "mongoose";
import { AccommodationInterface } from "../shared/interfaces";
import sanitizeHtml from "sanitize-html";

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
      set: (value: string) => sanitizeHtml(value),
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
      set: (value: string) => sanitizeHtml(value),
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
      set: (value: [string]) => value.map((service) => sanitizeHtml(service)),
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
        set: (value: string) => sanitizeHtml(value),
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
        set: (value: string) => sanitizeHtml(value),
      },
      phone: {
        type: Number,
        trim: true,
        validate: {
          validator: function (this: AccommodationInterface) {
            return this.location.phone.toString().length === 10;
          },
          message: "Le champ numéro de téléphone doit comporter 10 chiffres.",
        },
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
