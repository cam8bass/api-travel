import mongoose from "mongoose";
import client from "../../infisical";
/**
 * Establishes a connection to the MongoDB database using credentials retrieved from Infisical secrets.
 * It configures the mongoose connection with specific parameters such as database name, authentication mechanism,
 * TLS, connection pool size, timeouts, and compression.
 *
 * The function attempts to connect to the database and logs the success or failure of the connection.
 * In case of an error, it logs the error details differently based on the environment (development or production)
 * and then exits the process with a status code of 1 to indicate failure.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is successfully established, or rejects with an error.
 */
async function connectToDB(): Promise<void> {
  try {
    // Retrieve database connection details from Infisical secrets
    const { secretValue: DATABASE } = await client.getSecret("DATABASE");
    const { secretValue: DATABASE_PASSWORD } = await client.getSecret(
      "DATABASE_PASSWORD"
    );

    const { secretValue: DATABASE_NAME } = await client.getSecret(
      "DATABASE_NAME"
    );

    // Replace placeholder in the database URI with the actual password
    const databaseUri = DATABASE.replace("<password>", DATABASE_PASSWORD);

    // Connect to the MongoDB database with the specified options
    await mongoose.connect(databaseUri, {
      dbName: DATABASE_NAME,
      authMechanism: "SCRAM-SHA-256",
      tls: true,
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      serverSelectionTimeoutMS: 5000,
      autoIndex: false,
      compressors: ["zlib"],
    });

    // Log success message
    console.log("✅ Database connected");
  } catch (error) {
    // Retrieve the environment from process.env
    const { NODE_ENV } = process.env;

    // Log error details based on the environment
    if (NODE_ENV === "development") {
      console.error("💥 Error database:", error);
    } else if (NODE_ENV === "production") {
      console.error("💥 Error database:", error.name, error.message);
    }
    // Exit the process with a failure status code
    process.exit(1);
  }
}

export default connectToDB;
