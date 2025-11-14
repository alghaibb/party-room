import { NextResponse } from "next/server";
import { getUserRooms } from "@/app/dashboard/rooms/data";

export async function GET() {
  try {
    const rooms = await getUserRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch user rooms" },
      { status: 500 }
    );
  }
}

