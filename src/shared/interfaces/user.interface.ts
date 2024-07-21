import { userRole } from "../types/types";

export interface UserInterface {
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  password: string;
  passwordConfirm: string;
  createAt: Date;
  photo: {
    url: string;
    alt: string;
  };
  role: userRole;
}
