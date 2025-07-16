import { describe, it, expect, jest } from "@jest/globals";
import { validateBody } from "../../src/utils/validation.js";
import { registerSchema } from "../../src/validator/auth.validator.js";
import { generateTestUser } from "../helpers/testData.js";

describe("Validation Utils", () => {
  describe("validateBody", () => {
    it("should validate correct data successfully", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: testUser.password,
      };

      const result = await validateBody(userData, registerSchema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.data).toEqual(userData);
    });

    it("should return validation errors for invalid data", async () => {
      const invalidData = {
        name: "", // Invalid: empty name
        email: "invalid-email", // Invalid: not a valid email
        password: "123", // Invalid: too short
        confirmPassword: "456", // Invalid: doesn't match password
      };

      const result = await validateBody(invalidData, registerSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.data).toBeNull();
      expect(result.errors).toHaveProperty("name");
      expect(result.errors).toHaveProperty("email");
      expect(result.errors).toHaveProperty("password");
    });

    it("should handle missing required fields", async () => {
      const incompleteData = {
        name: "Test User",
        // Missing email, password, confirmPassword
      };

      const result = await validateBody(incompleteData, registerSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveProperty("email");
      expect(result.errors).toHaveProperty("password");
      expect(result.errors).toHaveProperty("confirmPassword");
    });

    it("should handle password mismatch", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: "DifferentPassword123!",
      };

      const result = await validateBody(userData, registerSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveProperty("confirmPassword");
    });

    it("should handle weak password", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        password: "weakpass",
        confirmPassword: "weakpass",
      };

      const result = await validateBody(userData, registerSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveProperty("password");
    });

    it("should handle schema validation errors gracefully", async () => {
      const invalidSchema = null;
      const testUser = generateTestUser();

      const result = await validateBody(testUser, invalidSchema);

      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.data).toBeNull();
    });
  });
});
