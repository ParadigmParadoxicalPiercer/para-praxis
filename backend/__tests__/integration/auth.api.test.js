import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import app from "../../index.js";
import { database } from "../../src/config/prisma.js";
import { generateTestUser } from "../helpers/testData.js";
import { clearDatabase } from "../helpers/setup.js";

describe("Authentication API Integration Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        status: "success",
        message: "User created successfully",
        data: {
          id: expect.any(Number),
          name: userData.name,
          email: userData.email,
          createdAt: expect.any(String),
        },
      });
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should reject registration with invalid email", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        email: "invalid-email",
        confirmPassword: testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(422);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Validation failed",
          statusCode: 422,
          details: expect.objectContaining({
            email: expect.any(String),
          }),
        },
      });
    });

    it("should reject registration with weak password", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        password: "weak",
        confirmPassword: "weak",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(422);

      expect(response.body.error.details).toHaveProperty("password");
    });

    it("should reject registration with password mismatch", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: "DifferentPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(422);

      expect(response.body.error.details).toHaveProperty("confirmPassword");
    });

    it("should reject duplicate email registration", async () => {
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: testUser.password,
      };

      // First registration
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Second registration with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Email already registered",
          statusCode: 409,
        },
      });
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const testUser = generateTestUser();
      const userData = {
        ...testUser,
        confirmPassword: testUser.password,
      };

      await request(app).post("/api/auth/register").send(userData);

      // Store user data for login tests
      global.testUser = testUser;
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        email: global.testUser.email,
        password: global.testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        status: "success",
        message: "Login successful",
        data: {
          user: {
            id: expect.any(Number),
            name: global.testUser.name,
            email: global.testUser.email,
            createdAt: expect.any(String),
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it("should reject login with invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: global.testUser.password,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Invalid email or password",
          statusCode: 401,
        },
      });
    });

    it("should reject login with invalid password", async () => {
      const loginData = {
        email: global.testUser.email,
        password: "WrongPassword123!",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        status: "fail",
        error: {
          message: "Invalid email or password",
          statusCode: 401,
        },
      });
    });

    it("should reject login with missing fields", async () => {
      const loginData = {
        email: global.testUser.email,
        // Missing password
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(422);

      expect(response.body.error.details).toHaveProperty("password");
    });
  });
});
