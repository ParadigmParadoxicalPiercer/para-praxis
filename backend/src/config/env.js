import dotenv from "dotenv";
import path from "path";

// โหลดตัวแปรสภาพแวดล้อม
dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "NODE_ENV", "PORT"];

// ตรวจสอบตัวแปรสภาพแวดล้อมที่จำเป็น
const validateEnv = () => {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// ออบเจ็คตค์ำหนดค่าสภาพแวดล้อม
const config = {
  // ค่าคอนฟิกเซิร์ฟเวอร์
  server: {
    port: parseInt(process.env.PORT) || 3333,
    host: process.env.HOST || "localhost",
    nodeEnv: process.env.NODE_ENV || "development",
  },

  // ค่าคอนฟิกฐานข้อมูล
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  },

  // CORS configuration เผื่อเปิดค้างไว้หลายอัน
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(",") || [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },

  // Development helpers
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};

// Validate environment on module load
validateEnv();

export default config;
