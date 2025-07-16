import config from "../config/env.js";

class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    this.currentLevel = this.levels[config.logging.level] || this.levels.info;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    };

    if (config.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
        Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ""
      }`;
    }

    return JSON.stringify(logData);
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);

      switch (level) {
        case "error":
          console.error(formattedMessage);
          break;
        case "warn":
          console.warn(formattedMessage);
          break;
        case "info":
          console.info(formattedMessage);
          break;
        case "debug":
          console.debug(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }
  }

  error(message, meta = {}) {
    this.log("error", message, meta);
  }

  warn(message, meta = {}) {
    this.log("warn", message, meta);
  }

  info(message, meta = {}) {
    this.log("info", message, meta);
  }

  debug(message, meta = {}) {
    this.log("debug", message, meta);
  }

  // Request logging middleware
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();

      // Log request
      this.info(`${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        userId: req.user?.id,
      });

      // Override res.end to log response
      const originalEnd = res.end;
      res.end = function (chunk, encoding) {
        const duration = Date.now() - start;

        logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          userId: req.user?.id,
        });

        originalEnd.call(this, chunk, encoding);
      };

      next();
    };
  }

  // Database operation logging
  dbLog(operation, table, data = {}) {
    this.debug(`DB Operation: ${operation} on ${table}`, data);
  }

  // Security logging
  securityLog(event, details = {}) {
    this.warn(`Security Event: ${event}`, details);
  }

  // Performance logging
  performanceLog(operation, duration, details = {}) {
    this.info(`Performance: ${operation} took ${duration}ms`, details);
  }
}

const logger = new Logger();

export default logger;
