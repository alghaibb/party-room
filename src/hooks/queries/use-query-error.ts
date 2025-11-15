"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook to handle React Query errors globally
 * Shows toast notifications for query failures
 */
export function useQueryError<T>(
  query: ReturnType<typeof useQuery<T>>,
  errorMessage?: string
) {
  useEffect(() => {
    if (query.error) {
      console.error("Query error:", query.error);
      toast.error(
        errorMessage || "Failed to load data. Please try again later."
      );
    }
  }, [query.error, errorMessage]);
}

