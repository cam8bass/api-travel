import cors from "cors";

export const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["x-api-key", "x-api-key-id", "Content-Type","sentry-trace", "baggage"],
  credentials: true,
};
