/**
 * Seed Games Script
 * Run this to add games to your database
 * Usage: pnpm tsx scripts/seed-games.ts
 */

import { seedGamesAndAchievements } from "@/app/dashboard/seed";
import "dotenv/config";

async function main() {
  try {
    await seedGamesAndAchievements();
    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

main();

