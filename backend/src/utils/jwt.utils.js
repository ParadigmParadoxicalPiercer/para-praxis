import jwt from "jsonwebtoken";
import config from "../config/env.js";
import logger from "./logger.js";

class JWTUtils {
  /**
   * เซ็น JWT token
   * @param {Object} payload - ข้อมูลใน token
   * @param {string} expiresIn - เวลาหมดอายุของ token
   * @returns {string} - token ที่เซ็นแล้ว
   */
  signToken(payload, expiresIn = config.jwt.expiresIn) {
    try {
      return jwt.sign(payload, config.jwt.secret, {
        expiresIn,
        issuer: "parapraxis-api",
        audience: "parapraxis-app",
      });
    } catch (error) {
      logger.error("การเซ็น JWT ล้มเหลว", { error: error.message });
      throw new Error("Token generation failed");
    }
  }

  /**
   * ตรวจสอบ JWT token
   * @param {string} token - token ที่ต้องการตรวจสอบ
   * @returns {Object} - ข้อมูลที่ถอดรหัสจาก token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, {
        issuer: "parapraxis-api",
        audience: "parapraxis-app",
      });
    } catch (error) {
      logger.warn("JWT verification failed", { error: error.message });
      throw error;
    }
  }

  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {string} - Access token
   */
  generateAccessToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      type: "access",
    };

    return this.signToken(payload, config.jwt.expiresIn);
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} - Refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      type: "refresh",
    };

    return this.signToken(payload, config.jwt.refreshExpiresIn);
  }

  /**
   * Generate token pair (access + refresh)
   * @param {Object} user - User object
   * @returns {Object} - Token pair
   */
  generateTokenPair(user) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  /**
   * Decode token without verification (for inspection)
   * @param {string} token - Token to decode
   * @returns {Object} - Decoded token
   */
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      logger.warn("JWT decoding failed", { error: error.message });
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param {string} token - Token to check
   * @returns {boolean} - True if expired
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.payload.exp) return true;

      return Date.now() >= decoded.payload.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - Token to check
   * @returns {Date|null} - Expiration date
   */
  getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.payload.exp) return null;

      return new Date(decoded.payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}

const jwtUtils = new JWTUtils();

export default jwtUtils;

// Backward compatibility exports
export const signJwt = (payload, expiresIn) =>
  jwtUtils.signToken(payload, expiresIn);
export const verifyJwt = (token) => jwtUtils.verifyToken(token);
