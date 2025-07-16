import { beforeAll, afterAll } from "@jest/globals";

console.log("🧪 Test setup initialized");

// Global test setup
beforeAll(async () => {
  console.log("🚀 Starting test suite...");
});

// Global test cleanup
afterAll(async () => {
  console.log("✅ Test suite completed");
});
