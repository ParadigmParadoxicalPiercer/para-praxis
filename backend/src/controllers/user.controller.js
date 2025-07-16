import {
  getUserById,
  updateUserById,
  deleteUserById,
  getUserStats as getUserStatsService,
  isEmailAvailable,
} from "../services/user.service.js";
import {
  createError,
  createNotFoundError,
  createConflictError,
  asyncHandler,
} from "../utils/createError.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../config/constants.js";
import responseHandler from "../utils/response.js";
import logger from "../utils/logger.js";

/**
 * Get user profile
 */
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { user } = req; // Set by requireAuth middleware

  logger.info("Get user profile request", { userId: user.id });

  const userProfile = await getUserById(user.id);
  if (!userProfile) {
    return next(createNotFoundError("User"));
  }

  return responseHandler.success(
    res,
    userProfile,
    "User profile retrieved successfully"
  );
});

/**
 * Update user profile
 */
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { user } = req; // Set by requireAuth middleware
  const updateData = req.body;

  logger.info("Update user profile request", {
    userId: user.id,
    fields: Object.keys(updateData),
  });

  // Check if email is being updated and is available
  if (updateData.email && updateData.email !== user.email) {
    const emailAvailable = await isEmailAvailable(updateData.email, user.id);
    if (!emailAvailable) {
      return next(createConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
    }
  }

  const updatedUser = await updateUserById(user.id, updateData);
  if (!updatedUser) {
    return next(createNotFoundError("User"));
  }

  logger.info("User profile updated successfully", { userId: user.id });

  return responseHandler.success(
    res,
    updatedUser,
    SUCCESS_MESSAGES.USER_UPDATED
  );
});

/**
 * Delete user profile
 */
export const deleteUserProfile = asyncHandler(async (req, res, next) => {
  const { user } = req; // Set by requireAuth middleware

  logger.info("Delete user profile request", { userId: user.id });

  const deleted = await deleteUserById(user.id);
  if (!deleted) {
    return next(createNotFoundError("User"));
  }

  logger.info("User profile deleted successfully", { userId: user.id });

  return responseHandler.success(res, null, SUCCESS_MESSAGES.USER_DELETED);
});

/**
 * Get user statistics
 */
export const getUserStats = asyncHandler(async (req, res, next) => {
  const { user } = req; // Set by requireAuth middleware

  logger.info("Get user stats request", { userId: user.id });

  const stats = await getUserStatsService(user.id);

  return responseHandler.success(
    res,
    stats,
    "User statistics retrieved successfully"
  );
});

export default {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserStats,
};
