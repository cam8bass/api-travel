import app from "./main";
import connectToDB from "./shared/services/connectDb.service";

import http from "http";

/**
 * Starts the server.
 */
async function startServer() {
  let server: http.Server;

  const { PORT, NODE_ENV } = process.env;

  await connectToDB();

  const port = PORT || 4002;

  server = app.listen(port, () => {
    console.log(`✅ Server is listening on port ${port}`);
  });

  server.on("error", (error: any) => {
    if (NODE_ENV === "development") {
      console.error("💥 Server startup error:", error);
    } else if (NODE_ENV === "production") {
      console.error("💥 Server startup error:", error.name, error.message);
    }

    server.close(() => {
      process.exit(1);
    });
  });
}

startServer();
