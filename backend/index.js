// Brief: Express app setup. Registers security, middleware, and API routes.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./src/config/env.js";
import logger from "./src/utils/logger.js";
import { notFound } from "./src/utils/notFound.js";
import errorHandler from "./src/utils/errorHandler.js";
import {
  helmetConfig,
  generalLimiter,
  corsOptions,
  securityHeaders,
  sanitizeRequest,
} from "./src/middleware/security.middleware.js";

// นำเข้า routes
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import journalRoutes from "./src/routes/journal.routes.js";
import taskRoutes from "./src/routes/tasks.routes.js";
import workoutRoutes from "./src/routes/workout.routes.js";
import focusRoutes from "./src/routes/focus.routes.js";
import workoutPlanRoutes from "./src/routes/workout-plan.routes.js";
import workoutExerciseRoutes from "./src/routes/workout-exercise.routes.js";
import userWorkoutTemplatesRoutes from "./src/routes/user-workout-templates.routes.js";
import mediaRoutes from "./src/routes/media.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(securityHeaders);
app.use(sanitizeRequest);

app.use(cookieParser());
// ตั้งค่า CORS
app.use(cors(corsOptions));

// จำกัดการเข้าถึง
app.use(generalLimiter);

// บันทึก log ของ request
if (config.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// middleware สำหรับอ่านข้อมูล
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// endpoint สำหรับเช็คสถานะ
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    version: "1.0.0",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/workout-exercises", workoutExerciseRoutes);
app.use("/api/workout-templates", userWorkoutTemplatesRoutes);
app.use("/api/media", mediaRoutes);

// จัดการหน้าที่ไม่พบ (404)
app.use(notFound);

// จัดการ error ทั่วไป
app.use(errorHandler);

export default app;
