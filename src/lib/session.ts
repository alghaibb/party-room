import type { Session } from "@/lib/auth";

/**
 * Fetches the current user session
 * Centralized session fetching to avoid duplication
 */
export async function fetchSession(): Promise<Session | null> {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

