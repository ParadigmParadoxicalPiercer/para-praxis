#!/usr/bin/env node

// Test runner script with better output formatting
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(title) {
  console.log("\n" + colorize("=".repeat(50), "blue"));
  console.log(colorize(`  ${title}`, "blue"));
  console.log(colorize("=".repeat(50), "blue") + "\n");
}

function runTests() {
  try {
    printHeader("🧪 Running Backend Tests");

    const testCommand = process.argv[2] || "test";
    const validCommands = [
      "test",
      "test:unit",
      "test:integration",
      "test:coverage",
      "test:watch",
    ];

    if (!validCommands.includes(testCommand)) {
      console.log(
        colorize("❌ Invalid test command. Available commands:", "red")
      );
      validCommands.forEach((cmd) => {
        console.log(colorize(`   - npm run ${cmd}`, "yellow"));
      });
      process.exit(1);
    }

    console.log(colorize(`🚀 Running: npm run ${testCommand}`, "cyan"));
    console.log(colorize("⏳ Please wait...", "yellow"));

    execSync(`npm run ${testCommand}`, {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test" },
    });

    console.log(colorize("\n✅ Tests completed successfully!", "green"));
  } catch (error) {
    console.log(colorize("\n❌ Tests failed!", "red"));
    console.log(colorize("Error details:", "red"));
    console.log(error.message);
    process.exit(1);
  }
}

// Show available test commands
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  printHeader("🧪 Test Commands");
  console.log(colorize("Available test commands:", "cyan"));
  console.log(
    colorize("  npm run test", "green") + "          - Run all tests"
  );
  console.log(
    colorize("  npm run test:unit", "green") + "      - Run unit tests only"
  );
  console.log(
    colorize("  npm run test:integration", "green") +
      " - Run integration tests only"
  );
  console.log(
    colorize("  npm run test:coverage", "green") +
      "   - Run tests with coverage"
  );
  console.log(
    colorize("  npm run test:watch", "green") + "     - Run tests in watch mode"
  );
  console.log(colorize("\nExample usage:", "yellow"));
  console.log(colorize("  node run-tests.js test:unit", "yellow"));
  console.log(colorize("  node run-tests.js test:coverage", "yellow"));
  process.exit(0);
}

runTests();
