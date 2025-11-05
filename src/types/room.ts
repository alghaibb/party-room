// Shared room-related types to reduce duplication across components

export interface RoomOwner {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
}

export interface RoomMember {
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
}

export interface GameInfo {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  category: string;
}

export interface GameResult {
  id: string;
  userId: string;
  gameSessionId: string;
  score: number;
  won: boolean;
  position: number | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    displayUsername: string | null;
    username: string | null;
  };
}

export interface ActiveGame {
  id: string;
  status: string;
  game: GameInfo;
  results: GameResult[];
  startedAt: Date | null;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  code: string;
  maxPlayers: number;
  currentPlayers: number;
  onlineMembers: number;
  owner: RoomOwner;
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

export interface DetailedRoom {
  id: string;
  name: string;
  description: string | null;
  code: string;
  maxPlayers: number;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  owner: RoomOwner;
  members: RoomMember[];
  currentGame: ActiveGame | null;
  memberCount: number;
  isOwner: boolean;
  currentUserId: string;
}
