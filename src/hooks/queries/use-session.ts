"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "@/lib/session";
import type { Session } from "@/lib/auth";

export function useSession() {
  return useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
  });
}

