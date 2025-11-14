"use server";

import { getSession } from "@/lib/get-session";
import { onboardingApiSchema } from "@/lib/validations/user/onboarding.schema";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to complete onboarding",
      };
    }

    // Check if user has already completed onboarding
    if (session.user.hasOnboarded) {
      return {
        success: false,
        message: "You have already completed onboarding",
      };
    }

    // Parse form data
    const username = formData.get("username") as string;
    const displayName = formData.get("displayName") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    const validationResult = onboardingApiSchema.safeParse({
      username,
      displayName,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid input data",
      };
    }

    const { username: validatedUsername, displayName: validatedDisplayName } = validationResult.data;

    // Check if username is available
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedUsername,
          mode: 'insensitive',
        },
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username is already taken",
      };
    }

    let imageUrl: string | undefined;

    // Handle image upload to Vercel Blob if provided
    if (imageFile && imageFile.size > 0) {
      // Validate image file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

      if (imageFile.size > maxSize) {
        return {
          success: false,
          message: "Image must be less than 5MB",
        };
      }

      if (!allowedTypes.includes(imageFile.type)) {
        return {
          success: false,
          message: "Image must be JPEG, PNG, WebP, or GIF format",
        };
      }

      try {
        // Upload to Vercel Blob
        const blob = await put(`avatars/${session.user.id}-${Date.now()}.${imageFile.type.split('/')[1]}`, imageFile, {
          access: "public",
        });
        imageUrl = blob.url;
      } catch (error) {
        console.error("Error uploading image to Vercel Blob:", error);
        return {
          success: false,
          message: "Failed to upload image. Please try again.",
        };
      }
    }

    // Update user with onboarding data
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: validatedUsername,
        displayUsername: validatedDisplayName,
        image: imageUrl,
        hasOnboarded: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Onboarding completed successfully!",
    };

  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function checkUsernameAvailability(username: string) {
  try {
    if (!username) {
      return {
        available: false,
        message: "Username parameter is required",
      };
    }

    // Validate username format (same as schema)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return {
        available: false,
        message: "Username can only contain letters, numbers, underscores, and hyphens",
      };
    }

    if (username.length < 3 || username.length > 20) {
      return {
        available: false,
        message: "Username must be between 3 and 20 characters",
      };
    }

    // Check if username exists in database (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: 'insensitive'
        }
      },
      select: {
        id: true
      }
    });

    const available = !existingUser;

    return {
      available,
      message: available ? "Username is available" : "Username is already taken",
    };

  } catch (error) {
    console.error("Error checking username availability:", error);
    return {
      available: false,
      message: "Failed to check username availability",
    };
  }
}

export async function getUserOnboardingData() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return null;
    }

    return {
      userName: session.user.name,
      userEmail: session.user.email,
      hasOnboarded: session.user.hasOnboarded,
      emailVerified: session.user.emailVerified,
    };
  } catch (error) {
    console.error("Error fetching user onboarding data:", error);
    return null;
  }
}

