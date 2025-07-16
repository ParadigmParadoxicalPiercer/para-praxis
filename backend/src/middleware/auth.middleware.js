import jwtUtils from "../utils/jwt.utils.js";
import { createAuthError } from "../utils/createError.js";
import prisma from "../config/prisma.js";

// Basic auth middleware - just check token and get user
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createAuthError("Authentication token required"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createAuthError("Authentication token required"));
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return next(createAuthError("User not found"));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createAuthError("Token has expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(createAuthError("Invalid token"));
    }
    return next(createAuthError("Authentication failed"));
  }
};

export default {
  requireAuth,
};
