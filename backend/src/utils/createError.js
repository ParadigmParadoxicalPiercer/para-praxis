import { HTTP_STATUS } from "../config/constants.js";
import logger from "./logger.js";

/**
 * คลาส error สำหรับแอปพลิเคชัน
 */
export class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    // จับ stack trace
    Error.captureStackTrace(this, this.constructor);

    // บันทึก log เมื่อสร้าง error
    logger.error(`AppError created: ${message}`, {
      statusCode,
      stack: this.stack,
    });
  }
}

/**
 * สร้าง error ของแอปพลิเคชัน
 * @param {number} statusCode - HTTP status code
 * @param {string} message - ข้อความ error
 * @param {boolean} isOperational - error นี้เป็น operational error หรือไม่
 * @returns {AppError} - instance ของ application error
 */
export const createError = (statusCode, message, isOperational = true) => {
  return new AppError(message, statusCode, isOperational);
};

/**
 * Create validation error
 * @param {string} message - Error message
 * @param {Object} details - Validation details
 * @returns {AppError} - Validation error instance
 */
export const createValidationError = (
  message = "Validation failed",
  details = {}
) => {
  const error = new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  error.details = details;
  return error;
};

/**
 * Create authentication error
 * @param {string} message - Error message
 * @returns {AppError} - Authentication error instance
 */
export const createAuthError = (message = "Authentication failed") => {
  return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Create authorization error
 * @param {string} message - Error message
 * @returns {AppError} - Authorization error instance
 */
export const createAuthorizationError = (message = "Access forbidden") => {
  return new AppError(message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Create not found error
 * @param {string} resource - Resource name
 * @returns {AppError} - Not found error instance
 */
export const createNotFoundError = (resource = "Resource") => {
  return new AppError(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
};

/**
 * Create conflict error
 * @param {string} message - Error message
 * @returns {AppError} - Conflict error instance
 */
export const createConflictError = (message = "Resource conflict") => {
  return new AppError(message, HTTP_STATUS.CONFLICT);
};

/**
 * Create too many requests error
 * @param {string} message - Error message
 * @returns {AppError} - Too many requests error instance
 */
export const createRateLimitError = (message = "Too many requests") => {
  return new AppError(message, HTTP_STATUS.TOO_MANY_REQUESTS);
};

/**
 * Handle async errors
 * @param {Function} fn - Async function
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle database errors
 * @param {Error} error - Database error
 * @returns {AppError} - Application error
 */
export const handleDatabaseError = (error) => {
  logger.error("Database error occurred", { error: error.message });

  // Handle specific Prisma errors
  if (error.code === "P2002") {
    return createConflictError("A record with this data already exists");
  }

  if (error.code === "P2025") {
    return createNotFoundError("Record");
  }

  if (error.code === "P2003") {
    return createError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid reference to related record"
    );
  }

  // Generic database error
  return createError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "Database operation failed"
  );
};

export default createError;
