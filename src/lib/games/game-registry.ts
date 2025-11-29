/**
 * Game Registry
 * Central registry for game components and metadata
 * Makes it easy to add new games and maintain game structure
 */

import type { Game } from "@/types/game";
import type { ComponentType } from "react";

export interface GameComponentProps {
  members: Array<{
    userId: string;
    user: { name: string; displayUsername: string | null };
  }>;
  currentUserId: string;
  gameSessionId: string;
  roomId: string;
  gameStatus: "waiting" | "playing" | "completed";
  onGameEnd?: (
    results: Array<{
      userId: string;
      score: number;
      won: boolean;
      position?: number;
    }>
  ) => void;
  isOwner?: boolean;
  onCancelGame?: () => void;
}

export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  component: ComponentType<GameComponentProps>;
  minPlayers: number;
  maxPlayers: number;
}

/**
 * Game Registry
 * Register game components here
 */
class GameRegistry {
  private games = new Map<string, GameMetadata>();

  /**
   * Register a game component
   */
  register(game: GameMetadata): void {
    this.games.set(game.id, game);
  }

  /**
   * Get a game by ID
   */
  get(gameId: string): GameMetadata | undefined {
    return this.games.get(gameId);
  }

  /**
   * Get all registered games
   */
  getAll(): GameMetadata[] {
    return Array.from(this.games.values());
  }

  /**
   * Get games by category
   */
  getByCategory(category: string): GameMetadata[] {
    return this.getAll().filter((game) => game.category === category);
  }

  /**
   * Check if a game is registered
   */
  has(gameId: string): boolean {
    return this.games.has(gameId);
  }

  /**
   * Get game component for a given game
   */
  getComponent(gameId: string): ComponentType<GameComponentProps> | null {
    const game = this.get(gameId);
    return game?.component || null;
  }

  /**
   * Match a database game to a registered game component
   */
  matchGame(dbGame: Game): GameMetadata | null {
    // Try exact ID match first
    if (this.has(dbGame.id)) {
      return this.get(dbGame.id)!;
    }

    // Try name-based matching (case-insensitive, trimmed)
    const dbGameName = dbGame.name.trim().toLowerCase();
    const matched = this.getAll().find(
      (registered) => registered.name.trim().toLowerCase() === dbGameName
    );

    if (matched) {
      return matched;
    }

    // Try partial name matching as fallback (for flexibility)
    const partialMatch = this.getAll().find((registered) => {
      const registeredName = registered.name.trim().toLowerCase();
      return (
        registeredName.includes(dbGameName) ||
        dbGameName.includes(registeredName)
      );
    });

    return partialMatch || null;
  }
}

// Singleton instance
export const gameRegistry = new GameRegistry();

/**
 * Helper function to register games
 * Usage: registerGame({ id: "trivia", name: "Trivia", ... })
 */
export function registerGame(game: GameMetadata): void {
  gameRegistry.register(game);
}

