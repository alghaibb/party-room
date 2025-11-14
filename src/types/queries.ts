// Types for React Query hooks and API responses

export interface UserStats {
  roomsJoined: number;
  gamesPlayed: number;
  friendsOnline: number;
  hoursPlayed: number;
  winRate: number;
  weeklyGames: number;
}

export interface RoomStats {
  totalActiveRooms: number;
  totalActivePlayers: number;
  gamesInProgress: number;
}

export interface ActiveRoom {
  id: string;
  name: string;
  description: string | null;
  code: string;
  maxPlayers: number;
  currentPlayers: number;
  onlineMembers: number;
  owner: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  currentGame: {
    name: string;
    category: string;
  } | null;
  members: Array<{
    name: string;
    username: string | null;
    image: string | null;
    isOnline: boolean;
  }>;
  createdAt: Date;
}

export interface UserRoom {
  id: string;
  name: string;
  description: string | null;
  code: string;
  maxPlayers: number;
  currentPlayers: number;
  owner: {
    name: string;
    username: string | null;
    image: string | null;
  };
  joinedAt: Date;
  isOnline: boolean;
}

export interface RoomDetails {
  id: string;
  name: string;
  description: string | null;
  code: string;
  maxPlayers: number;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  members: Array<{
    id: string;
    userId: string;
    joinedAt: Date;
    isOnline: boolean;
    user: {
      id: string;
      name: string;
      username: string | null;
      image: string | null;
    };
  }>;
  currentGame: {
    id: string;
    status: string;
    game: unknown;
    results: unknown[];
    startedAt: Date | null;
  } | null;
  memberCount: number;
  isOwner: boolean;
  currentUserId: string;
}

export interface RoomMessage {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
}

export interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  category: string;
}

