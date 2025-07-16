import { describe, it, expect } from "@jest/globals";

describe("Test Setup Verification", () => {
  it("should verify Jest is working correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("should verify async testing works", async () => {
    const promise = Promise.resolve("test");
    const result = await promise;
    expect(result).toBe("test");
  });

  it("should verify mock functions work", () => {
    const mockFn = jest.fn();
    mockFn("test");
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("should verify environment variables are loaded", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
