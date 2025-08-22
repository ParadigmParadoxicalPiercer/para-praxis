// Brief: Prisma client wrapper. Provides connect/disconnect with safe shutdown.
import { PrismaClient } from "@prisma/client";
import config from "./env.js";
import logger from "../utils/logger.js";

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      // keep Prisma logs minimal; use our logger instead
      log: config.isDevelopment ? ["warn", "error"] : ["error"],
      errorFormat: "pretty",
    });
  this.connected = false;
  this.disconnecting = false;
  }

  async connect() {
    try {
  if (this.connected) return;
  await this.prisma.$connect();
  this.connected = true;
  logger.info("Database connected");
    } catch (error) {
  logger.error("Database connection failed", { error: String(error) });
      process.exit(1);
    }
  }

  async disconnect() {
    try {
  if (!this.connected || this.disconnecting) return;
  this.disconnecting = true;
  await this.prisma.$disconnect();
  this.connected = false;
  this.disconnecting = false;
  logger.info("Database disconnected");
    } catch (error) {
  logger.error("Database disconnection failed", { error: String(error) });
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

// Note: Shutdown signals are handled centrally in server.js to avoid duplicate handling

export default database.prisma;
export { database };
