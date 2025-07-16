import { HTTP_STATUS, API_RESPONSE } from "../config/constants.js";
import logger from "./logger.js";

class ResponseHandler {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {*} data - Data to send
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @param {Object} meta - Additional metadata
   */
  success(
    res,
    data = null,
    message = "Success",
    statusCode = HTTP_STATUS.OK,
    meta = {}
  ) {
    const response = {
      status: API_RESPONSE.SUCCESS,
      message,
      data,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    logger.info(`Response: ${statusCode} - ${message}`, {
      data: data ? Object.keys(data) : null,
    });

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} details - Error details
   */
  error(
    res,
    message = "Internal Server Error",
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details = {}
  ) {
    const response = {
      status: API_RESPONSE.ERROR,
      message,
      timestamp: new Date().toISOString(),
      ...(Object.keys(details).length > 0 && { details }),
    };

    logger.error(`Error Response: ${statusCode} - ${message}`, details);

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   * @param {Object} res - Express response object
   * @param {Object} errors - Validation errors
   * @param {string} message - Error message
   */
  validationError(res, errors = {}, message = "Validation failed") {
    const response = {
      status: API_RESPONSE.FAIL,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };

    logger.warn(`Validation Error: ${message}`, { errors });

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
  }

  /**
   * Send paginated response
   * @param {Object} res - Express response object
   * @param {Array} data - Data array
   * @param {Object} pagination - Pagination info
   * @param {string} message - Success message
   */
  paginated(res, data, pagination, message = "Data retrieved successfully") {
    const response = {
      status: API_RESPONSE.SUCCESS,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
        hasNext:
          pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    };

    logger.info(`Paginated Response: ${message}`, {
      count: data.length,
      page: pagination.page,
      total: pagination.total,
    });

    return res.status(HTTP_STATUS.OK).json(response);
  }

  /**
   * Send created response
   * @param {Object} res - Express response object
   * @param {*} data - Created data
   * @param {string} message - Success message
   */
  created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Send no content response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   */
  noContent(res, message = "Operation completed successfully") {
    logger.info(`No Content Response: ${message}`);
    return res.status(HTTP_STATUS.NO_CONTENT).json({
      status: API_RESPONSE.SUCCESS,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  unauthorized(res, message = "Unauthorized access") {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  forbidden(res, message = "Access forbidden") {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send not found response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  notFound(res, message = "Resource not found") {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send conflict response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  conflict(res, message = "Resource conflict") {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  /**
   * Send too many requests response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  /**
   * Send internal server error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {Error} error - Original error object
   */
  internalError(res, message = "Internal server error", error = null) {
    const details =
      error && process.env.NODE_ENV === "development"
        ? { stack: error.stack, name: error.name }
        : {};

    return this.error(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR, details);
  }
}

const responseHandler = new ResponseHandler();

export default responseHandler;
