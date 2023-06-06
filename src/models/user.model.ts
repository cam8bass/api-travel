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
    type: String,
    default: "default-profile.png",
    trim: true,
    set: (value: string) => sanitizeHtml(value),
    validate: {
      validator: function (this: UserInterface) {
        const validExtension = [".jpg", ".jpeg", ".png", ".webp"];
        const extension = path.extname(this.photo).toLowerCase();
        if (validExtension.includes(extension)) {
          return true;
        }
        return false;
      },
      message:
        "Les formats d'image utilisables sont le JPG, JPEG, PNG et WebP.",
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
