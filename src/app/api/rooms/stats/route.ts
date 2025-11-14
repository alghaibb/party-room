import { NextResponse } from "next/server";
import { getRoomStats } from "@/app/dashboard/rooms/data";

export async function GET() {
  try {
    const stats = await getRoomStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching room stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch room stats" },
      { status: 500 }
    );
  }
}

