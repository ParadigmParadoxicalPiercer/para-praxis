// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_ALREADY_EXISTS: "Email already registered",
  TOKEN_REQUIRED: "Authentication token required",
  INVALID_TOKEN: "Invalid or expired token",
  UNAUTHORIZED_ACCESS: "Unauthorized access",

  // User
  USER_NOT_FOUND: "User not found",
  USER_CREATION_FAILED: "Failed to create user",
  USER_UPDATE_FAILED: "Failed to update user",

  // Journal
  JOURNAL_NOT_FOUND: "Journal entry not found",
  JOURNAL_CREATION_FAILED: "Failed to create journal entry",
  JOURNAL_UPDATE_FAILED: "Failed to update journal entry",
  JOURNAL_DELETE_FAILED: "Failed to delete journal entry",

  // Tasks
  TASK_NOT_FOUND: "Task not found",
  TASK_CREATION_FAILED: "Failed to create task",
  TASK_UPDATE_FAILED: "Failed to update task",
  TASK_DELETE_FAILED: "Failed to delete task",

  // Workout
  WORKOUT_NOT_FOUND: "Workout not found",
  WORKOUT_PLAN_NOT_FOUND: "Workout plan not found",

  // Validation
  VALIDATION_ERROR: "Validation error",
  INVALID_INPUT: "Invalid input provided",

  // General
  INTERNAL_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
  FORBIDDEN: "Access forbidden",
  TOO_MANY_REQUESTS: "Too many requests",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",

  JOURNAL_CREATED: "Journal entry created successfully",
  JOURNAL_UPDATED: "Journal entry updated successfully",
  JOURNAL_DELETED: "Journal entry deleted successfully",

  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASK_COMPLETED: "Task marked as completed",

  WORKOUT_CREATED: "Workout created successfully",
  WORKOUT_UPDATED: "Workout updated successfully",
  WORKOUT_DELETED: "Workout deleted successfully",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  CONTENT_MAX_LENGTH: 10000,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  UPLOAD_PATH: "uploads/",
};

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId) => `user:profile:${userId}`,
  USER_JOURNALS: (userId) => `user:journals:${userId}`,
  USER_TASKS: (userId) => `user:tasks:${userId}`,
  USER_WORKOUTS: (userId) => `user:workouts:${userId}`,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  USER_DATA: 180, // 3 minutes
  GENERAL: 60, // 1 minute
};

// Task Status
export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// User Roles (for future use)
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

// API Response Format
export const API_RESPONSE = {
  SUCCESS: "success",
  ERROR: "error",
  FAIL: "fail",
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
};

// Date Formats
export const DATE_FORMATS = {
  ISO: "YYYY-MM-DDTHH:mm:ss.sssZ",
  DISPLAY: "YYYY-MM-DD HH:mm:ss",
  DATE_ONLY: "YYYY-MM-DD",
  TIME_ONLY: "HH:mm:ss",
};
