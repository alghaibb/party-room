/**
 * Question Service
 * Handles random question selection for games
 */

import type { TriviaQuestion } from "./trivia-questions";
import { TRIVIA_QUESTIONS_POOL } from "./trivia-questions";

/**
 * Seeded random number generator
 * Ensures all players get the same questions for the same game session
 */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return () => {
    hash = (hash << 5) - hash + hash;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

/**
 * Get random questions for a game session
 * Uses seeded random to ensure all players get the same questions
 */
export function getRandomQuestions(
  gameSessionId: string,
  count: number,
  category?: string,
  difficulty?: "easy" | "medium" | "hard"
): TriviaQuestion[] {
  // Filter questions by category and difficulty if specified
  let pool = TRIVIA_QUESTIONS_POOL;
  
  if (category) {
    pool = pool.filter((q) => q.category === category);
  }
  
  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // If pool is too small, use all available questions
  if (pool.length <= count) {
    return pool;
  }

  // Use seeded random for consistent selection across all players
  const random = seededRandom(gameSessionId);
  const shuffled = [...pool].sort(() => random() - 0.5);
  
  return shuffled.slice(0, count);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
  category: string,
  count?: number
): TriviaQuestion[] {
  const filtered = TRIVIA_QUESTIONS_POOL.filter(
    (q) => q.category === category
  );
  
  if (count && count < filtered.length) {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  return filtered;
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set(TRIVIA_QUESTIONS_POOL.map((q) => q.category));
  return Array.from(categories).sort();
}

/**
 * Get question count by category
 */
export function getQuestionCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  
  TRIVIA_QUESTIONS_POOL.forEach((q) => {
    counts[q.category] = (counts[q.category] || 0) + 1;
  });
  
  return counts;
}




