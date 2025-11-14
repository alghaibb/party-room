import { NextResponse } from "next/server";
import { getRoomDetails } from "@/app/dashboard/rooms/[roomId]/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const room = await getRoomDetails(roomId);
    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room details:", error);
    return NextResponse.json(
      { error: "Failed to fetch room details" },
      { status: 500 }
    );
  }
}

