import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import config from "../config/env.js";
import { createRateLimitError } from "../utils/createError.js";
import logger from "../utils/logger.js";

/**
 * Configure Helmet for security headers
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      upgradeInsecureRequests: config.isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting configuration
 */
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: "error",
      message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        url: req.url,
        userAgent: req.get("User-Agent"),
      });

      const error = createRateLimitError(message);
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

/**
 * General rate limiter
 */
export const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP, please try again later"
);

/**
 * Auth rate limiter (stricter)
 */
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  "Too many authentication attempts, please try again later"
);

/**
 * Password reset rate limiter
 */
export const passwordResetLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  "Too many password reset attempts, please try again later"
);

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-API-Key",
  ],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
};

/**
 * Security middleware to add additional security headers
 */
export const securityHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader("X-Powered-By");

  // Add custom security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Add API version header
  res.setHeader("X-API-Version", "1.0.0");

  next();
};

/**
 * Request sanitization middleware
 */
export const sanitizeRequest = (req, res, next) => {
  // Remove null bytes
  const sanitize = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/\0/g, "");
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      });
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};

/**
 * IP whitelist middleware (for admin routes)
 */
export const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP)) {
      next();
    } else {
      logger.warn("Unauthorized IP access attempt", {
        ip: clientIP,
        url: req.url,
        userAgent: req.get("User-Agent"),
      });

      res.status(403).json({
        status: "error",
        message: "Access denied",
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Request size limiter
 */
export const requestSizeLimit = (limit = "10mb") => {
  return (req, res, next) => {
    const contentLength = req.get("content-length");
    const maxSize = parseInt(limit) || 10 * 1024 * 1024; // 10MB default

    if (contentLength && parseInt(contentLength) > maxSize) {
      logger.warn("Request size exceeded", {
        size: contentLength,
        limit: maxSize,
        ip: req.ip,
        url: req.url,
      });

      return res.status(413).json({
        status: "error",
        message: "Request entity too large",
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      logger.warn("Request timeout", {
        url: req.url,
        method: req.method,
        ip: req.ip,
      });

      if (!res.headersSent) {
        res.status(408).json({
          status: "error",
          message: "Request timeout",
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    res.on("finish", () => clearTimeout(timeout));
    res.on("close", () => clearTimeout(timeout));

    next();
  };
};

export default {
  helmetConfig,
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  corsOptions,
  securityHeaders,
  sanitizeRequest,
  ipWhitelist,
  requestSizeLimit,
  requestTimeout,
};
