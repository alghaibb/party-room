import { NextResponse } from "next/server";
import { getRoomMessages } from "@/app/dashboard/rooms/[roomId]/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const messages = await getRoomMessages(roomId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching room messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch room messages" },
      { status: 500 }
    );
  }
}

