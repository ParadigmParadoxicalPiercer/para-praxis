import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../index.js";
import { generateTestUser } from "../helpers/testData.js";
import { clearDatabase } from "../helpers/setup.js";

describe("Protected Routes Integration Tests", () => {
  let userToken;
  let testUser;

  beforeEach(async () => {
    await clearDatabase();

    // Create and login a test user
    testUser = generateTestUser();
    const userData = {
      ...testUser,
      confirmPassword: testUser.password,
    };

    // Register user
    await request(app).post("/api/auth/register").send(userData);

    // Login and get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    userToken = loginResponse.body.data.accessToken;
  });

  describe("GET /api/users/profile", () => {
    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: "success",
        data: {
          id: expect.any(Number),
          name: testUser.name,
          email: testUser.email,
          createdAt: expect.any(String),
        },
      });
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/users/profile").expect(401);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Authentication token required",
          statusCode: 401,
        },
      });
    });

    it("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: expect.stringContaining("Invalid token"),
          statusCode: 401,
        },
      });
    });

    it("should reject request with malformed authorization header", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "InvalidFormat token")
        .expect(401);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Authentication token required",
          statusCode: 401,
        },
      });
    });
  });

  describe("Rate Limiting", () => {
    it("should apply rate limiting to auth endpoints", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Make multiple failed login attempts
      const promises = [];
      for (let i = 0; i < 6; i++) {
        promises.push(request(app).post("/api/auth/login").send(loginData));
      }

      const responses = await Promise.all(promises);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(
        (res) => res.status === 429
      );
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe("Health Check", () => {
    it("should respond to health check", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toMatchObject({
        status: "healthy",
        timestamp: expect.any(String),
        environment: "development",
        version: "1.0.0",
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Route not found",
          statusCode: 404,
        },
      });
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.status).toBe("fail");
      expect(response.body.error.statusCode).toBe(400);
    });
  });
});
