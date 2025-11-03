import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export async function getUserStats() {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Total games played by this user
    const gamesPlayed = await prisma.gameResult.count({
      where: { userId }
    });

    // Games won by this user
    const gamesWon = await prisma.gameResult.count({
      where: {
        userId,
        won: true
      }
    });

    // Calculate win rate
    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

    // Games played this week
    const weeklyGames = await prisma.gameResult.count({
      where: {
        userId,
        createdAt: {
          gte: weekAgo
        }
      }
    });

    // Rooms joined (unique rooms user has been in)
    const roomsJoined = await prisma.roomMember.count({
      where: { userId }
    });

    // Friends online (accepted friendships with online members)
    const friendsOnline = await prisma.friendship.count({
      where: {
        OR: [
          { senderId: userId, status: "accepted" },
          { receiverId: userId, status: "accepted" }
        ]
      }
    });

    // Estimate hours played (assuming average 30 min per game)
    const hoursPlayed = Math.round(gamesPlayed * 0.5); // 30 min average per game

    return {
      roomsJoined,
      gamesPlayed,
      friendsOnline,
      hoursPlayed,
      winRate,
      weeklyGames,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Return fallback data
    return {
      roomsJoined: 0,
      gamesPlayed: 0,
      friendsOnline: 0,
      hoursPlayed: 0,
      winRate: 0,
      weeklyGames: 0,
    };
  }
}

export async function getNavigationData() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        username: session.user.username,
        displayUsername: session.user.displayUsername,
      },
    };
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return null;
  }
}