import mongoose from "mongoose";
import { nodeEnv } from "../types/types";
import client from "../../infisical";
async function connectToDB(): Promise<void> {
  try {
    const { secretValue: DATABSE } = await client.getSecret("DATABASE");
    const { secretValue: DATABASE_PASSWORD } = await client.getSecret(
      "DATABASE_PASSWORD"
    );

    const databaseUri = DATABSE.replace("<password>", DATABASE_PASSWORD);

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
