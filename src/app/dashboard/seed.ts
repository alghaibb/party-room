// Seed data for Party Room games
// Run this once to populate the games table

import prisma from "@/lib/prisma";

export const defaultGames = [
  {
    name: "Trivia Challenge",
    description: "Test your knowledge with fun trivia questions!",
    minPlayers: 2,
    maxPlayers: 8,
    category: "trivia"
  },
  {
    name: "Word Guess",
    description: "Guess the hidden word letter by letter!",
    minPlayers: 2,
    maxPlayers: 6,
    category: "word"
  },
  {
    name: "Number Guess",
    description: "Guess the secret number between 1 and 100!",
    minPlayers: 2,
    maxPlayers: 8,
    category: "party"
  },
  {
    name: "Drawing Guessing Game",
    description: "Draw and guess what others are drawing",
    minPlayers: 3,
    maxPlayers: 8,
    category: "drawing"
  },
  {
    name: "Word Association",
    description: "Quick-fire word association game",
    minPlayers: 2,
    maxPlayers: 6,
    category: "word"
  },
  {
    name: "20 Questions",
    description: "Guess the mystery object in 20 questions",
    minPlayers: 2,
    maxPlayers: 8,
    category: "guessing"
  },
  {
    name: "Story Builder",
    description: "Collaborative storytelling game",
    minPlayers: 3,
    maxPlayers: 6,
    category: "creative"
  },
  {
    name: "Quick Quiz",
    description: "Fast-paced general knowledge quiz",
    minPlayers: 2,
    maxPlayers: 10,
    category: "trivia"
  }
];

export const defaultAchievements = [
  {
    name: "First Victory",
    description: "Win your first game",
    category: "games",
    requirement: 1,
    icon: "🏆"
  },
  {
    name: "Hat Trick",
    description: "Win 3 games in a row",
    category: "competitive",
    requirement: 3,
    icon: "🎯"
  },
  {
    name: "Social Butterfly",
    description: "Add 5 friends",
    category: "social",
    requirement: 5,
    icon: "🦋"
  },
  {
    name: "Party Animal",
    description: "Join 10 different party rooms",
    category: "social",
    requirement: 10,
    icon: "🎉"
  },
  {
    name: "Marathon Gamer",
    description: "Play for 10+ hours",
    category: "time",
    requirement: 10,
    icon: "⏰"
  },
  {
    name: "Game Master",
    description: "Play 50 games",
    category: "games",
    requirement: 50,
    icon: "👑"
  }
];

export async function seedGamesAndAchievements() {
  try {
    console.log("🌱 Seeding games and achievements...");

    // Add default games
    for (const game of defaultGames) {
      await prisma.game.upsert({
        where: { name: game.name },
        update: {},
        create: game,
      });
    }

    // Add default achievements  
    for (const achievement of defaultAchievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      });
    }

    console.log("✅ Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}
