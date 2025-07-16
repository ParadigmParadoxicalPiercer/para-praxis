import { createError } from "./createError.js";
import { HTTP_STATUS } from "../config/constants.js";
import logger from "./logger.js";

/**
 * Handle 404 - Not Found errors
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const notFound = (req, res, next) => {
  logger.warn("Route not found", {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  const message = `Route ${req.originalUrl} not found`;
  next(createError(HTTP_STATUS.NOT_FOUND, message));
};

export default notFound;
