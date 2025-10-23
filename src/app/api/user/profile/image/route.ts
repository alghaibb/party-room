import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { profileImageSchema } from "@/lib/validations/profile.schema";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate the image
    const validationResult = profileImageSchema.safeParse({ image: imageFile });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid image",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Check if user already has an image and delete it
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // If user has an existing image, delete it from Vercel Blob
    if (currentUser?.image) {
      try {
        await del(currentUser.image);
      } catch (blobError) {
        console.error("Failed to delete old image from Vercel Blob:", blobError);
        // Continue with upload even if old image deletion fails
      }
    }

    // Generate a unique filename with profile folder structure
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileExtension = imageFile.name.split(".").pop();
    const filename = `profile/${session.user.id}/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, imageFile, {
      access: "public",
      addRandomSuffix: false, // We handle our own suffix for organization
    });

    // Update user profile with new image URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        displayUsername: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser, imageUrl: blob.url });
  } catch (error) {
    console.error("Failed to upload profile image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user to check if they have an image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // If user has an image, delete it from Vercel Blob
    if (currentUser?.image) {
      try {
        await del(currentUser.image);
      } catch (blobError) {
        console.error("Failed to delete image from Vercel Blob:", blobError);
        // Continue with database update even if blob deletion fails
        // This prevents orphaned database records
      }
    }

    // Update user profile to remove image
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        displayUsername: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to delete profile image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
