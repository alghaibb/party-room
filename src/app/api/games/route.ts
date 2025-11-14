import { NextResponse } from "next/server";
import { getAvailableGames } from "@/app/dashboard/rooms/[roomId]/data";

export async function GET() {
  try {
    const games = await getAvailableGames();
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching available games:", error);
    return NextResponse.json(
      { error: "Failed to fetch available games" },
      { status: 500 }
    );
  }
}

