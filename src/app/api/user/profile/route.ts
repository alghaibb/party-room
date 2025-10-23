import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { z } from "zod";
import prisma from "@/lib/prisma";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayUsername: z.string().min(3).max(20).trim().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { name, displayUsername } = validationResult.data;

    // Update the user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        displayUsername: displayUsername || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
