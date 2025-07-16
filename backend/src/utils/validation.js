import * as yup from "yup";
import { VALIDATION_RULES, REGEX } from "../config/constants.js";
import { createValidationError } from "../utils/createError.js";
import logger from "../utils/logger.js";

/**
 * schema สำหรับการตรวจสอบข้อมูลพื้นฐาน
 */
const baseSchemas = {
  email: yup
    .string()
    .email("กรุณาใส่อีเมลที่ถูกต้อง")
    .max(
      VALIDATION_RULES.EMAIL_MAX_LENGTH,
      `อีเมลต้องไม่เกิน ${VALIDATION_RULES.EMAIL_MAX_LENGTH} ตัวอักษร`
    )
    .required("จำเป็นต้องใส่อีเมล"),

  password: yup
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `รหัสผ่านต้องมีอย่างน้อย ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ตัวอักษร`
    )
    .max(
      VALIDATION_RULES.PASSWORD_MAX_LENGTH,
      `รหัสผ่านต้องไม่เกิน ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} ตัวอักษร`
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),

  name: yup
    .string()
    .trim()
    .min(
      VALIDATION_RULES.NAME_MIN_LENGTH,
      `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`
    )
    .max(
      VALIDATION_RULES.NAME_MAX_LENGTH,
      `Name must not exceed ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`
    )
    .required("Name is required"),

  title: yup
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      VALIDATION_RULES.TITLE_MAX_LENGTH,
      `Title must not exceed ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters`
    )
    .required("Title is required"),

  description: yup
    .string()
    .trim()
    .max(
      VALIDATION_RULES.DESCRIPTION_MAX_LENGTH,
      `Description must not exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`
    )
    .nullable(),

  content: yup
    .string()
    .trim()
    .max(
      VALIDATION_RULES.CONTENT_MAX_LENGTH,
      `Content must not exceed ${VALIDATION_RULES.CONTENT_MAX_LENGTH} characters`
    )
    .nullable(),

  id: yup
    .number()
    .integer("ID must be an integer")
    .positive("ID must be positive")
    .required("ID is required"),

  optionalId: yup
    .number()
    .integer("ID must be an integer")
    .positive("ID must be positive")
    .nullable(),

  boolean: yup.boolean().required("Boolean value is required"),

  date: yup.date().required("Date is required"),

  optionalDate: yup.date().nullable(),

  url: yup.string().url("Please provide a valid URL").nullable(),

  phone: yup
    .string()
    .matches(REGEX.PHONE, "Please provide a valid phone number")
    .nullable(),
};

/**
 * Authentication validation schemas
 */
export const authSchemas = {
  register: yup.object({
    name: baseSchemas.name,
    email: baseSchemas.email,
    password: baseSchemas.password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  }),

  login: yup.object({
    email: baseSchemas.email,
    password: yup.string().required("Password is required"),
  }),

  forgotPassword: yup.object({
    email: baseSchemas.email,
  }),

  resetPassword: yup.object({
    token: yup.string().required("Reset token is required"),
    password: baseSchemas.password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  }),

  changePassword: yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: baseSchemas.password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  }),
};

/**
 * User validation schemas
 */
export const userSchemas = {
  updateProfile: yup.object({
    name: baseSchemas.name.optional(),
    email: baseSchemas.email.optional(),
    phone: baseSchemas.phone,
    bio: yup.string().max(500, "Bio must not exceed 500 characters").nullable(),
  }),

  updateSettings: yup.object({
    theme: yup
      .string()
      .oneOf(["light", "dark", "auto"], "Invalid theme")
      .optional(),
    language: yup
      .string()
      .oneOf(["en", "es", "fr", "de"], "Invalid language")
      .optional(),
    notifications: yup.boolean().optional(),
    emailNotifications: yup.boolean().optional(),
  }),
};

/**
 * Journal validation schemas
 */
export const journalSchemas = {
  create: yup.object({
    title: baseSchemas.title,
    content: baseSchemas.content.required("Content is required"),
    mood: yup
      .string()
      .oneOf(
        ["happy", "sad", "neutral", "angry", "excited", "anxious"],
        "Invalid mood"
      )
      .nullable(),
    tags: yup
      .array()
      .of(yup.string())
      .max(10, "Maximum 10 tags allowed")
      .nullable(),
  }),

  update: yup.object({
    title: baseSchemas.title.optional(),
    content: baseSchemas.content.optional(),
    mood: yup
      .string()
      .oneOf(
        ["happy", "sad", "neutral", "angry", "excited", "anxious"],
        "Invalid mood"
      )
      .nullable(),
    tags: yup
      .array()
      .of(yup.string())
      .max(10, "Maximum 10 tags allowed")
      .nullable(),
  }),

  query: yup.object({
    page: yup.number().integer().min(1).default(1),
    limit: yup.number().integer().min(1).max(100).default(10),
    search: yup.string().max(100).nullable(),
    mood: yup
      .string()
      .oneOf(["happy", "sad", "neutral", "angry", "excited", "anxious"])
      .nullable(),
    startDate: baseSchemas.optionalDate,
    endDate: baseSchemas.optionalDate,
  }),
};

/**
 * Task validation schemas
 */
export const taskSchemas = {
  create: yup.object({
    title: baseSchemas.title,
    description: baseSchemas.description,
    priority: yup
      .string()
      .oneOf(["low", "medium", "high", "urgent"], "Invalid priority")
      .default("medium"),
    dueDate: baseSchemas.optionalDate,
    category: yup
      .string()
      .max(50, "Category must not exceed 50 characters")
      .nullable(),
  }),

  update: yup.object({
    title: baseSchemas.title.optional(),
    description: baseSchemas.description,
    priority: yup
      .string()
      .oneOf(["low", "medium", "high", "urgent"], "Invalid priority")
      .optional(),
    completed: baseSchemas.boolean.optional(),
    dueDate: baseSchemas.optionalDate,
    category: yup
      .string()
      .max(50, "Category must not exceed 50 characters")
      .nullable(),
  }),

  query: yup.object({
    page: yup.number().integer().min(1).default(1),
    limit: yup.number().integer().min(1).max(100).default(10),
    search: yup.string().max(100).nullable(),
    priority: yup
      .string()
      .oneOf(["low", "medium", "high", "urgent"])
      .nullable(),
    completed: baseSchemas.boolean.nullable(),
    category: yup.string().max(50).nullable(),
    startDate: baseSchemas.optionalDate,
    endDate: baseSchemas.optionalDate,
  }),
};

/**
 * Workout validation schemas
 */
export const workoutSchemas = {
  createPlan: yup.object({
    name: baseSchemas.name,
    description: baseSchemas.description,
    difficulty: yup
      .string()
      .oneOf(["beginner", "intermediate", "advanced"], "Invalid difficulty")
      .default("beginner"),
    duration: yup
      .number()
      .integer()
      .min(5)
      .max(300)
      .required("Duration is required"),
    targetMuscles: yup
      .array()
      .of(yup.string())
      .min(1, "At least one target muscle is required"),
  }),

  updatePlan: yup.object({
    name: baseSchemas.name.optional(),
    description: baseSchemas.description,
    difficulty: yup
      .string()
      .oneOf(["beginner", "intermediate", "advanced"], "Invalid difficulty")
      .optional(),
    duration: yup.number().integer().min(5).max(300).optional(),
    targetMuscles: yup
      .array()
      .of(yup.string())
      .min(1, "At least one target muscle is required")
      .optional(),
  }),

  addExercise: yup.object({
    workoutPlanId: baseSchemas.id,
    exerciseName: yup.string().required("Exercise name is required"),
    sets: yup.number().integer().min(1).max(20).required("Sets are required"),
    reps: yup.number().integer().min(1).max(100).required("Reps are required"),
    weight: yup.number().min(0).max(1000).nullable(),
    duration: yup.number().integer().min(1).max(3600).nullable(),
    restTime: yup.number().integer().min(0).max(600).nullable(),
  }),
};

/**
 * Pagination validation schema
 */
export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  sortBy: yup.string().max(50).nullable(),
  sortOrder: yup.string().oneOf(["asc", "desc"]).default("desc"),
});

/**
 * Validation middleware factory
 * @param {Object} schema - Yup validation schema
 * @param {string} source - Source of data (body, query, params)
 * @returns {Function} - Validation middleware
 */
export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const validatedData = await schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      req[source] = validatedData;
      next();
    } catch (error) {
      logger.warn("Validation failed", {
        source,
        errors: error.errors,
        data: req[source],
      });

      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }

      next(createValidationError("Validation failed", validationErrors));
    }
  };
};

/**
 * Body validation middleware
 * @param {Object} schema - Yup validation schema
 * @returns {Function} - Validation middleware
 */
export const validateBody = (schema) => validate(schema, "body");

/**
 * Query validation middleware
 * @param {Object} schema - Yup validation schema
 * @returns {Function} - Validation middleware
 */
export const validateQuery = (schema) => validate(schema, "query");

/**
 * Params validation middleware
 * @param {Object} schema - Yup validation schema
 * @returns {Function} - Validation middleware
 */
export const validateParams = (schema) => validate(schema, "params");

/**
 * ID parameter validation schema
 */
export const idParamSchema = yup.object({
  id: baseSchemas.id,
});

/**
 * Common validation middleware
 */
export const validateId = validateParams(idParamSchema);
export const validatePagination = validateQuery(paginationSchema);

// Export individual schemas for backward compatibility
export const registerSchema = authSchemas.register;
export const loginSchema = authSchemas.login;
