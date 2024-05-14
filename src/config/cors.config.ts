import cors from "cors";

export const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "x-api-key", "x-api-key-id"],
  credentials: false,
};
