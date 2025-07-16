import { describe, it, expect, jest } from "@jest/globals";
import jwtUtils from "../../src/utils/jwt.utils.js";
import { generateTestToken } from "../helpers/testData.js";

describe("JWT Utils", () => {
  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const payload = generateTestToken();
      const token = jwtUtils.generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should include all required fields in token", () => {
      const payload = generateTestToken();
      const token = jwtUtils.generateAccessToken(payload);
      const decoded = jwtUtils.verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.name).toBe(payload.name);
      expect(decoded.type).toBe("access");
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const payload = generateTestToken();
      const token = jwtUtils.generateRefreshToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should have correct token type", () => {
      const payload = generateTestToken();
      const token = jwtUtils.generateRefreshToken(payload);
      const decoded = jwtUtils.verifyToken(token);

      expect(decoded.type).toBe("refresh");
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const payload = generateTestToken();
      const token = jwtUtils.generateAccessToken(payload);
      const decoded = jwtUtils.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload.userId);
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => {
        jwtUtils.verifyToken(invalidToken);
      }).toThrow();
    });

    it("should throw error for malformed token", () => {
      const malformedToken = "not-a-jwt-token";

      expect(() => {
        jwtUtils.verifyToken(malformedToken);
      }).toThrow();
    });
  });

  describe("generateTokens", () => {
    it("should generate both access and refresh tokens", () => {
      const payload = generateTestToken();
      const tokens = jwtUtils.generateTokens(payload);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(typeof tokens.accessToken).toBe("string");
      expect(typeof tokens.refreshToken).toBe("string");
    });

    it("should generate tokens with correct types", () => {
      const payload = generateTestToken();
      const tokens = jwtUtils.generateTokens(payload);

      const accessDecoded = jwtUtils.verifyToken(tokens.accessToken);
      const refreshDecoded = jwtUtils.verifyToken(tokens.refreshToken);

      expect(accessDecoded.type).toBe("access");
      expect(refreshDecoded.type).toBe("refresh");
    });
  });
});
