import mongoose from "mongoose";
import { nodeEnv } from "../types/types";

async function connectToDB(databaseUri: string): Promise<void> {
  try {
    await mongoose.connect(databaseUri);
    console.log("✅ Database connected");
  } catch (error) {
    const nodeEnv = process.env.NODE_ENV as nodeEnv;

    if (nodeEnv === "development") {
      console.error("💥 Error database:", error);
    } else if (nodeEnv === "production") {
      console.error("💥 Error database:", error.name, error.message);
    }
    process.exit(1);
  }
}

export default connectToDB;
