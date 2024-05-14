import { errorStatus, requestHttpType } from "../types/types";

export interface sendRequestHttpInterface {
  url: string;
  method?: requestHttpType;
}

export interface sendRequestDataInterface {
  idApiKey: string;
  apiKey: string;
}

export interface sendRequestResponseInterface {
  status: "success" | errorStatus;
  data: {
    role: "user" | "admin";
    auth: boolean;
  };
}
