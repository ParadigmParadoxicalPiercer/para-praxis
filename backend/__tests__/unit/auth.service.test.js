import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import bcrypt from "bcryptjs";
import { AuthService } from "../../src/services/auth.service.js";
import {
  generateTestUser,
  generateTestUserForDb,
} from "../helpers/testData.js";

// Mock Prisma client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
  },
};

// Mock the prisma import
jest.mock("../../src/config/prisma.js", () => ({
  default: mockPrismaClient,
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const testUser = generateTestUser();
      const createdUser = {
        id: 1,
        name: testUser.name,
        email: testUser.email,
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue(createdUser);

      const result = await AuthService.createUser(testUser);

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: testUser.email },
      });
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          name: testUser.name,
          email: testUser.email,
          password: expect.any(String),
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it("should throw error if user already exists", async () => {
      const testUser = generateTestUser();
      const existingUser = {
        id: 1,
        email: testUser.email,
        name: "Existing User",
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(existingUser);

      await expect(AuthService.createUser(testUser)).rejects.toThrow(
        "Email already registered"
      );
      expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
    });

    it("should hash password before saving", async () => {
      const testUser = generateTestUser();
      const hashedPassword = "hashed_password";

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue({
        id: 1,
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
      });

      jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);

      await AuthService.createUser(testUser);

      expect(bcrypt.hash).toHaveBeenCalledWith(testUser.password, 10);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          name: testUser.name,
          email: testUser.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe("verifyUser", () => {
    it("should verify user with correct credentials", async () => {
      const testUser = generateTestUser();
      const dbUser = await generateTestUserForDb(testUser);

      mockPrismaClient.user.findUnique.mockResolvedValue(dbUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const result = await AuthService.verifyUser(
        testUser.email,
        testUser.password
      );

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: testUser.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        testUser.password,
        dbUser.password
      );
      expect(result).toEqual(dbUser);
    });

    it("should throw error for non-existent user", async () => {
      const testUser = generateTestUser();

      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      await expect(
        AuthService.verifyUser(testUser.email, testUser.password)
      ).rejects.toThrow("Invalid email or password");
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw error for incorrect password", async () => {
      const testUser = generateTestUser();
      const dbUser = await generateTestUserForDb(testUser);

      mockPrismaClient.user.findUnique.mockResolvedValue(dbUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(
        AuthService.verifyUser(testUser.email, "wrong_password")
      ).rejects.toThrow("Invalid email or password");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrong_password",
        dbUser.password
      );
    });
  });

  describe("getUserById", () => {
    it("should get user by ID successfully", async () => {
      const userId = 1;
      const user = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(user);

      const result = await AuthService.getUserById(userId);

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(user);
    });

    it("should throw error if user not found", async () => {
      const userId = 999;

      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      await expect(AuthService.getUserById(userId)).rejects.toThrow(
        "User not found"
      );
    });
  });
});
