import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";
import config from "../src/config/env.js";

async function main() {
  const email = "demo@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(
      "Password123!",
      config.security.bcryptRounds
    );
    await prisma.user.create({
      data: { name: "Demo User", email, password: hashed },
    });
    console.log("Seed: created demo user demo@example.com / Password123!");
  } else {
    console.log("Seed: demo user already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
