import path from "path";
import { Schema, model } from "mongoose";
import { UserInterface } from "../shared/interfaces";
import validator from "validator";
import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";

const userSchema = new Schema<UserInterface>({
  firstname: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [3, "Le champ prénom doit comporter au minimum 3 caractères"],
    maxlength: [15, "Le champ prénom doit comporter au maximum 15 caractères"],
    validate: [
      validator.isAlpha,
      "Le champ prénom doit comporter uniquement des lettres",
    ],
    required: [true, "Le champ prénom est obligatoire"],
  },
  lastname: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [3, "Le champ nom doit comporter au minimum 3 caractères"],
    maxlength: [15, "Le champ nom doit comporter au maximum 15 caractères"],
    validate: [
      validator.isAlpha,
      "Le champ nom doit comporter uniquement des lettres",
    ],
    required: [true, "Le champ nom est obligatoire"],
  },
  pseudo: {
    type: String,
    minlength: [5, "Le champ pseudo doit contenir au minimum 5 caractères"],
    maxlength: [20, "Le champ pseudo doit contenir au maximum 20 caractères"],
    lowercase: true,
    validate: [
      validator.isAlphanumeric,
      "Le champ pseudo ne peut contenir que des lettres et des chiffres.",
    ],
    trim: true,
    required: [true, "Le champ pseudo est obligatoire"],
  },
  email: {
    type: String,
    required: [true, "Le champ email est obligatoire"],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [
      validator.isEmail,
      "Veuillez renseigner une adresse email valide",
    ],
  },
  photo: {
    url: {
      type: String,
      default: "default-profile.png",
      trim: true,
      validate: [
        {
          validator: function (this: UserInterface) {
            return validator.isURL(this.photo.url, {
              protocols: ["https"],
              require_protocol: true,
            });
          },
          message: "Veuillez entrer une URL valide utilisant HTTPS.",
        },
        {
          validator: function (this: UserInterface) {
            const validExtension = [".jpg", ".jpeg", ".png", ".webp"];
            const extension = path.extname(this.photo.url).toLowerCase();
            return validExtension.includes(extension);
          },
          message:
            "Les formats d'image utilisables sont le JPG, JPEG, PNG et WebP.",
        },
      ],
    },
    alt: {
      type: String,
      trim: true,
      minlength: [
        10,
        "Le champ description de l'image doit contenir au minimum 10 caractères",
      ],
      maxlength: [
        250,
        "Le champ description de l'image doit contenir au maximum 250 caractères",
      ],
      required: [true, "Le champ description de l'image est obligatoire"],
      set: (value: string) => sanitizeHtml(value),
    },
  },
  role: {
    type: String,
    enum: ["user", "guide"],
    default: "user",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  password: {
    type: String,
    required: [true, "Le champ password est obligatoire"],
    trim: true,
    validate: [
      validator.isStrongPassword,
      "Le champ mot de passe doit contenir au minimum une lettre minuscule, une majuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caractères.",
    ],
    maxlength: [30, "Le champ mot de passe ne doit pas dépasser 30 caractères"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Le champ mot de passe de confirmation est obligatoire"],
    trim: true,
    validate: {
      validator: function (this: UserInterface): boolean {
        return this.password === this.passwordConfirm;
      },
      message:
        "Le mot de passe de confirmation doit être identique au mot de passe.",
    },
  },
});

userSchema.index({ email: 1 });

/**
 * Middleware to exclude the version key (`__v`) from the result of find queries.
 * This is a pre-find hook that runs before executing any find query on the User model.
 * It modifies the query to exclude the `__v` field, which is automatically added by Mongoose to track document revisions.
 *
 * @param next - The next middleware function in the stack.
 * This function does not explicitly return a value but calls `next()` to pass control to the next middleware function.
 */
userSchema.pre(/^find/, function (next) {
  // Exclude the `__v` field from the results.
  this.select("-__v");
  next();
});

/**
 * Middleware for hashing the user's password before saving it to the database.
 * This function checks if the password field of the document has been modified.
 * If the password has not been modified, the middleware passes control to the next middleware function without making any changes.
 * If the password has been modified, it hashes the new password using bcrypt with a salt round of 12,
 * then sets the `passwordConfirm` field to `undefined` to prevent it from being saved to the database.
 * Finally, it calls the next middleware function in the stack.
 *
 * @param next - A callback function to pass control to the next middleware function in the pre-save middleware stack.
 * @returns {Promise<void>} This function does not explicitly return a value but must call `next()` to continue the middleware chain.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = model<UserInterface>("User", userSchema);

export default User;
