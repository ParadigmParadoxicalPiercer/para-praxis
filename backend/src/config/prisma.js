import { PrismaClient } from "@prisma/client";
import config from "./env.js";

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: config.isDevelopment
        ? ["query", "info", "warn", "error"]
        : ["error"],
      errorFormat: "pretty",
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      console.log("✅ Database disconnected successfully");
    } catch (error) {
      console.error("❌ Database disconnection failed:", error);
    }
  }

  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", timestamp: new Date().toISOString() };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

const database = new Database();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await database.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await database.disconnect();
  process.exit(0);
});

export default database.prisma;
export { database };
