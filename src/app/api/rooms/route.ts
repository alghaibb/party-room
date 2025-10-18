import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { createRoomSchema } from "@/lib/validations/room.schema";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createRoomSchema.parse(body);

    // Create the room
    const room = await prisma.room.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        isPrivate: validatedData.isPrivate ?? false,
        maxMembers: validatedData.maxMembers,
        createdBy: session.user.id,
      },
    });

    // Add the creator as the first member with OWNER role
    await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: session.user.id,
        role: "OWNER",
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get rooms the user is a member of
    const userRooms = await prisma.roomMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        room: {
          include: {
            _count: {
              select: { members: true }
            },
            creator: {
              select: { displayUsername: true, name: true }
            }
          }
        }
      },
      orderBy: {
        joinedAt: "desc"
      },
    });

    const rooms = userRooms.map(member => ({
      ...member.room,
      userRole: member.role,
    }));

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
