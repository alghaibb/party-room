import { NextResponse } from "next/server";
import { getActiveRooms } from "@/app/dashboard/rooms/data";

export async function GET() {
  try {
    const rooms = await getActiveRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching active rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch active rooms" },
      { status: 500 }
    );
  }
}

