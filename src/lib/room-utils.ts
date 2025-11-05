import prisma from "@/lib/prisma";
import { ROOM_CONSTANTS } from "@/constants/room";

/**
 * Generates a unique 6-digit room code
 * Format: ABC123 (uppercase letters and numbers)
 */
export async function generateRoomCode(): Promise<string> {
  const characters = ROOM_CONSTANTS.CODE_CHARACTERS;
  let attempts = 0;
  const maxAttempts = ROOM_CONSTANTS.CODE_GENERATION_MAX_ATTEMPTS;

  while (attempts < maxAttempts) {
    let code = "";

    // Generate 6-character code
    for (let i = 0; i < ROOM_CONSTANTS.CODE_LENGTH; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      // Check if code already exists
      const existingRoom = await prisma.partyRoom.findUnique({
        where: { code },
        select: { id: true },
      });

      if (!existingRoom) {
        return code;
      }
    } catch (error) {
      console.error("Error checking room code uniqueness:", error);
    }

    attempts++;
  }

  // Fallback: use timestamp-based code if all random attempts fail
  const timestamp = Date.now().toString().slice(-6);
  const fallbackCode = timestamp.padStart(6, "0").toUpperCase();

  console.warn(`Generated fallback room code after ${maxAttempts} attempts: ${fallbackCode}`);
  return fallbackCode;
}

/**
 * Validates if a room code format is correct
 */
export function isValidRoomCodeFormat(code: string): boolean {
  return new RegExp(`^[A-Z0-9]{${ROOM_CONSTANTS.CODE_LENGTH}}$`).test(code);
}

/**
 * Formats user input into proper room code format
 */
export function formatRoomCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, ROOM_CONSTANTS.CODE_LENGTH);
}

