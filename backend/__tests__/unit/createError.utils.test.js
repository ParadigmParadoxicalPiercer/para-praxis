import { describe, it, expect, jest } from "@jest/globals";
import {
  createError,
  createAuthError,
  createValidationError,
  createNotFoundError,
} from "../../src/utils/createError.js";

describe("Error Creation Utils", () => {
  describe("createError", () => {
    it("should create a basic error with message and status code", () => {
      const message = "Test error message";
      const statusCode = 500;

      const error = createError(message, statusCode);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.name).toBe("CustomError");
    });

    it("should create error with additional data", () => {
      const message = "Test error";
      const statusCode = 400;
      const additionalData = { field: "email", value: "invalid" };

      const error = createError(message, statusCode, additionalData);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.data).toEqual(additionalData);
    });

    it("should default to status code 500 if not provided", () => {
      const error = createError("Test error");

      expect(error.statusCode).toBe(500);
    });
  });

  describe("createAuthError", () => {
    it("should create authentication error with 401 status", () => {
      const message = "Authentication failed";

      const error = createAuthError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe("AuthenticationError");
    });

    it("should create auth error with additional data", () => {
      const message = "Invalid token";
      const data = { tokenType: "access" };

      const error = createAuthError(message, data);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(401);
      expect(error.data).toEqual(data);
    });
  });

  describe("createValidationError", () => {
    it("should create validation error with 422 status", () => {
      const message = "Validation failed";

      const error = createValidationError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe("ValidationError");
    });

    it("should create validation error with field errors", () => {
      const message = "Validation failed";
      const fieldErrors = {
        email: "Invalid email format",
        password: "Password too short",
      };

      const error = createValidationError(message, fieldErrors);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(422);
      expect(error.data).toEqual(fieldErrors);
    });
  });

  describe("createNotFoundError", () => {
    it("should create not found error with 404 status", () => {
      const message = "Resource not found";

      const error = createNotFoundError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe("NotFoundError");
    });

    it("should create not found error with resource details", () => {
      const message = "User not found";
      const resourceData = { resourceType: "User", id: 123 };

      const error = createNotFoundError(message, resourceData);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(404);
      expect(error.data).toEqual(resourceData);
    });
  });
});
