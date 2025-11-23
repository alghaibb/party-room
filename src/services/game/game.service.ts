/**
 * Game service - handles game-related data access
 */

import prisma from "@/lib/prisma";
import { cache } from "react";
import type { Game } from "@/types/game";

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

      return games.map((game) => ({
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



