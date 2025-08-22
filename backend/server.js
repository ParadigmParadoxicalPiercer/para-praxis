// Brief: Entry point. Boots DB, starts Express, and handles graceful shutdown.
import config from "./src/config/env.js";
import { database } from "./src/config/prisma.js";
import app from "./index.js";
import logger from "./src/utils/logger.js";

// จัดการ uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Start server
    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Server running on port ${config.server.port}`, {
        port: config.server.port,
        env: config.server.nodeEnv,
        host: config.server.host,
      });
    });

    // Handle graceful shutdown
    let isShuttingDown = false;
    const gracefulShutdown = (signal) => {
      if (isShuttingDown) return; // prevent duplicate handling
      isShuttingDown = true;
      logger.info(`Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        // Close database connection (idempotent in Database class)
        await database.disconnect();

        logger.info("Application terminated");
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", { error: error.message });
    process.exit(1);
  }
};

startServer();
