/**
 * Game-related types
 */

export interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  category: string;
  isActive?: boolean;
}



