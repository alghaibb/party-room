/**
 * Game service - handles game-related data access
 */

import prisma from "@/lib/prisma";
import type { Game } from "@/types/game";
import { cache } from "react";

export const gameService = {
  /**
   * Get all available active games
   */
  getAvailableGames: cache(async (): Promise<Game[]> => {
    try {
      const games = await prisma.game.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          { category: "asc" },
          { name: "asc" },
        ],
      });

      type GameResult = typeof games[0];
      return games.map((game: GameResult) => ({
        id: game.id,
        name: game.name,
        description: game.description,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        category: game.category,
      }));
    } catch (error) {
      console.error("Error fetching available games:", error);
      return [];
    }
  }),
};




