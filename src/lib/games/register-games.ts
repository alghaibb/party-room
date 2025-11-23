/**
 * Game Registration
 * Register all game components here
 * This makes it easy to add new games - just import and register!
 */

import { DrawingGuessingGame } from "@/app/dashboard/rooms/[roomId]/_components/games/DrawingGuessingGame";
import { NumberGuessGame } from "@/app/dashboard/rooms/[roomId]/_components/games/NumberGuessGame";
import { QuickQuizGame } from "@/app/dashboard/rooms/[roomId]/_components/games/QuickQuizGame";
import { StoryBuilderGame } from "@/app/dashboard/rooms/[roomId]/_components/games/StoryBuilderGame";
import { TriviaGame } from "@/app/dashboard/rooms/[roomId]/_components/games/TriviaGame";
import { TwentyQuestionsGame } from "@/app/dashboard/rooms/[roomId]/_components/games/TwentyQuestionsGame";
import { WordAssociationGame } from "@/app/dashboard/rooms/[roomId]/_components/games/WordAssociationGame";
import { WordGuessGame } from "@/app/dashboard/rooms/[roomId]/_components/games/WordGuessGame";
import { GAME_CATEGORIES } from "@/constants/game";
import { registerGame } from "./game-registry";

/**
 * Register all games
 * Call this function during app initialization
 */
export function registerAllGames(): void {
  // Register Trivia Game
  registerGame({
    id: "trivia", // This should match the game ID in your database
    name: "Trivia Challenge",
    description: "Test your knowledge with fun trivia questions!",
    category: GAME_CATEGORIES.TRIVIA,
    component: TriviaGame,
    minPlayers: 2,
    maxPlayers: 8,
  });

  // Register Word Guess Game
  registerGame({
    id: "word-guess",
    name: "Word Guess",
    description: "Guess the hidden word letter by letter!",
    category: GAME_CATEGORIES.WORD,
    component: WordGuessGame,
    minPlayers: 2,
    maxPlayers: 6,
  });

  // Register Number Guess Game
  registerGame({
    id: "number-guess",
    name: "Number Guess",
    description: "Guess the secret number between 1 and 100!",
    category: GAME_CATEGORIES.PARTY,
    component: NumberGuessGame,
    minPlayers: 2,
    maxPlayers: 8,
  });

  // Register Drawing Guessing Game (Placeholder)
  registerGame({
    id: "drawing-guessing",
    name: "Drawing Guessing Game",
    description: "Draw and guess what others are drawing",
    category: GAME_CATEGORIES.DRAWING,
    component: DrawingGuessingGame,
    minPlayers: 3,
    maxPlayers: 8,
  });

  // Register Word Association (Placeholder)
  registerGame({
    id: "word-association",
    name: "Word Association",
    description: "Quick-fire word association game",
    category: GAME_CATEGORIES.WORD,
    component: WordAssociationGame,
    minPlayers: 2,
    maxPlayers: 6,
  });

  // Register 20 Questions (Placeholder)
  registerGame({
    id: "20-questions",
    name: "20 Questions",
    description: "Guess the mystery object in 20 questions",
    category: GAME_CATEGORIES.GUESSING,
    component: TwentyQuestionsGame,
    minPlayers: 2,
    maxPlayers: 8,
  });

  // Register Story Builder (Placeholder)
  registerGame({
    id: "story-builder",
    name: "Story Builder",
    description: "Collaborative storytelling game",
    category: GAME_CATEGORIES.CREATIVE,
    component: StoryBuilderGame,
    minPlayers: 3,
    maxPlayers: 6,
  });

  // Register Quick Quiz (Placeholder)
  registerGame({
    id: "quick-quiz",
    name: "Quick Quiz",
    description: "Fast-paced general knowledge quiz",
    category: GAME_CATEGORIES.TRIVIA,
    component: QuickQuizGame,
    minPlayers: 2,
    maxPlayers: 10,
  });
}

