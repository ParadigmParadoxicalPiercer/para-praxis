import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/**
 * Generate test user data
 */
export function generateTestUser(overrides = {}) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "Password123!",
    ...overrides,
  };
}

/**
 * Generate test user with hashed password for database
 */
export async function generateTestUserForDb(overrides = {}) {
  const user = generateTestUser(overrides);
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return {
    ...user,
    password: hashedPassword,
  };
}

/**
 * Generate test journal entry
 */
export function generateTestJournal(overrides = {}) {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    ...overrides,
  };
}

/**
 * Generate test task
 */
export function generateTestTask(overrides = {}) {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    completed: faker.datatype.boolean(),
    ...overrides,
  };
}

/**
 * Generate test workout plan
 */
export function generateTestWorkoutPlan(overrides = {}) {
  return {
    name: faker.lorem.words(3),
    week: faker.number.int({ min: 1, max: 52 }),
    ...overrides,
  };
}

/**
 * Generate test workout exercise
 */
export function generateTestWorkoutExercise(overrides = {}) {
  return {
    name: faker.lorem.words(2),
    description: faker.lorem.paragraph(),
    completed: faker.datatype.boolean(),
    reps: faker.number.int({ min: 1, max: 20 }),
    sets: faker.number.int({ min: 1, max: 5 }),
    ...overrides,
  };
}

/**
 * Generate test media
 */
export function generateTestMedia(overrides = {}) {
  return {
    url: faker.image.url(),
    publicId: faker.string.alphanumeric(20),
    ...overrides,
  };
}

/**
 * Generate JWT token for testing
 */
export function generateTestToken(payload = {}) {
  return {
    userId: faker.number.int({ min: 1, max: 1000 }),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    ...payload,
  };
}
