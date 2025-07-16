import { AppError } from "./createError.js";
import { HTTP_STATUS, API_RESPONSE } from "../config/constants.js";
import logger from "./logger.js";
import config from "../config/env.js";

/**
 * Handle different types of errors
 */
class ErrorHandler {
  /**
   * Handle Prisma errors
   * @param {Error} error - Prisma error
   * @returns {AppError} - Formatted error
   */
  handlePrismaError(error) {
    let message = "Database operation failed";
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    switch (error.code) {
      case "P2002":
        message = "A record with this data already exists";
        statusCode = HTTP_STATUS.CONFLICT;
        break;
      case "P2025":
        message = "Record not found";
        statusCode = HTTP_STATUS.NOT_FOUND;
        break;
      case "P2003":
        message = "Invalid reference to related record";
        statusCode = HTTP_STATUS.BAD_REQUEST;
        break;
      case "P2014":
        message = "Invalid ID provided";
        statusCode = HTTP_STATUS.BAD_REQUEST;
        break;
      case "P2021":
        message = "Table does not exist";
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        break;
      case "P2022":
        message = "Column does not exist";
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        break;
    }

    return new AppError(message, statusCode);
  }

  /**
   * Handle JWT errors
   * @param {Error} error - JWT error
   * @returns {AppError} - Formatted error
   */
  handleJWTError(error) {
    let message = "Authentication failed";

    if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    }

    return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Handle validation errors
   * @param {Error} error - Validation error
   * @returns {AppError} - Formatted error
   */
  handleValidationError(error) {
    const errors = {};

    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
    }

    const appError = new AppError(
      "Validation failed",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
    appError.details = errors;
    return appError;
  }

  /**
   * Handle cast errors
   * @param {Error} error - Cast error
   * @returns {AppError} - Formatted error
   */
  handleCastError(error) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Send error response in development
   * @param {Error} err - Error object
   * @param {Object} res - Response object
   */
  sendErrorDev(err, res) {
    const response = {
      status: err.status || API_RESPONSE.ERROR,
      error: {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        name: err.name,
        ...(err.details && { details: err.details }),
      },
      timestamp: new Date().toISOString(),
    };

    logger.error("Error in development", response.error);

    res
      .status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(response);
  }

  /**
   * Send error response in production
   * @param {Error} err - Error object
   * @param {Object} res - Response object
   */
  sendErrorProd(err, res) {
    // Only send operational errors to client
    if (err.isOperational) {
      const response = {
        status: err.status || API_RESPONSE.ERROR,
        message: err.message,
        timestamp: new Date().toISOString(),
        ...(err.details && { details: err.details }),
      };

      res.status(err.statusCode).json(response);
    } else {
      // Log error and send generic message
      logger.error("Programming error", { error: err });

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_RESPONSE.ERROR,
        message: "Something went wrong!",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Main error handling middleware
   * @param {Error} err - Error object
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  globalErrorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    error.status = err.status || API_RESPONSE.ERROR;

    // Log error
    logger.error(`Global error handler: ${err.message}`, {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id,
      stack: err.stack,
    });

    // Handle specific error types
    if (err.code?.startsWith("P")) {
      error = this.handlePrismaError(err);
    } else if (err.name === "ValidationError") {
      error = this.handleValidationError(err);
    } else if (err.name === "CastError") {
      error = this.handleCastError(err);
    } else if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      error = this.handleJWTError(err);
    } else if (!(err instanceof AppError)) {
      // Convert unknown errors to AppError
      error = new AppError(
        err.message || "Internal server error",
        err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    // Send error response
    if (config.isDevelopment) {
      this.sendErrorDev(error, res);
    } else {
      this.sendErrorProd(error, res);
    }
  }
}

const errorHandler = new ErrorHandler();

export { errorHandler };
export default errorHandler.globalErrorHandler.bind(errorHandler);
