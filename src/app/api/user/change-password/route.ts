import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { z } from "zod";
import prisma from "@/lib/prisma";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { newPassword } = validationResult.data;

    // Find the user's account with password
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        password: { not: null }
      }
    });

    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // Update the password and set passwordChangedAt
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: newPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
