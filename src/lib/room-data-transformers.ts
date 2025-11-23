/**
 * Utility functions for transforming room data
 */

export interface TransformedMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface TransformedMember {
  userId: string;
  user: {
    name: string;
    displayUsername: string | null;
  };
}

interface DatabaseMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string | Date;
}

/**
 * Transform database messages to ChatArea format
 */
export function transformMessages(
  dbMessages: unknown
): TransformedMessage[] {
  if (!dbMessages || !Array.isArray(dbMessages) || dbMessages.length === 0) {
    return [];
  }

  return dbMessages.map((msg: DatabaseMessage) => ({
    id: msg.id,
    content: msg.content,
    user: {
      id: msg.user.id,
      name: msg.user.name,
    },
    createdAt:
      typeof msg.createdAt === "string"
        ? msg.createdAt
        : new Date(msg.createdAt).toISOString(),
  }));
}

interface DatabaseMember {
  id: string;
  userId: string;
  joinedAt: Date;
  isOnline: boolean;
  user: {
    id: string;
    name: string;
    displayUsername?: string | null;
    username?: string | null;
    image?: string | null;
  };
}

/**
 * Transform room members to GameArea format
 */
export function transformMembersForGameArea(
  members: unknown
): TransformedMember[] {
  if (!members || !Array.isArray(members)) {
    return [];
  }

  return members.map((m: DatabaseMember) => ({
    userId: m.userId,
    user: {
      name: m.user.name,
      displayUsername: m.user.displayUsername || m.user.name,
    },
  }));
}

/**
 * Transform room members to PlayerList format
 */
export function transformMembersForPlayerList(
  members: unknown
): Array<{
  id: string;
  userId: string;
  joinedAt: Date;
  isOnline: boolean;
  user: {
    id: string;
    name: string;
    displayUsername: string | null;
    username: string | null;
    image: string | null;
  };
}> {
  if (!members || !Array.isArray(members)) {
    return [];
  }

  return members.map((m: DatabaseMember) => ({
    id: m.id,
    userId: m.userId,
    joinedAt: m.joinedAt,
    isOnline: m.isOnline,
    user: {
      id: m.user.id,
      name: m.user.name,
      displayUsername: m.user.displayUsername || m.user.name,
      username: m.user.username || null,
      image: m.user.image || null,
    },
  }));
}

/**
 * Get display username from user object
 */
export function getDisplayUsername(
  user: { name: string; displayUsername?: string | null }
): string {
  return user.displayUsername || user.name;
}

