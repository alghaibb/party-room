"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface CreateQueryHookOptions<T> {
  queryKey: string[];
  fetchFn: () => Promise<T>;
  staleTime?: number;
  refetchOnMount?: boolean;
  enabled?: boolean;
}

interface CreateParamQueryHookOptions<T, P> {
  baseQueryKey: string[];
  fetchFn: (param: P) => Promise<T>;
  staleTime?: number;
  refetchOnMount?: boolean;
  getEnabled?: (param: P) => boolean;
}

/**
 * Factory function to create reusable query hooks with consistent configuration
 */
export function createQueryHook<T>({
  queryKey,
  fetchFn,
  staleTime = 30 * 1000,
  refetchOnMount = false,
  enabled = true,
}: CreateQueryHookOptions<T>) {
  return function useQueryHook(options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">) {
    return useQuery({
      queryKey,
      queryFn: fetchFn,
      staleTime,
      refetchOnMount,
      enabled: enabled && (options?.enabled ?? true),
      ...options,
    });
  };
}

/**
 * Factory function to create parameterized query hooks
 */
export function createParamQueryHook<T, P extends string | number>({
  baseQueryKey,
  fetchFn,
  staleTime = 30 * 1000,
  refetchOnMount = false,
  getEnabled = (param) => !!param,
}: CreateParamQueryHookOptions<T, P>) {
  return function useParamQueryHook(
    param: P,
    options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">
  ) {
    const enabled = getEnabled(param);
    return useQuery({
      queryKey: [...baseQueryKey, param],
      queryFn: () => fetchFn(param),
      staleTime,
      refetchOnMount,
      enabled,
      ...options,
    });
  };
}

/**
 * Creates a fetch function with error handling
 */
export function createFetchFn<T>(endpoint: string, errorMessage: string): () => Promise<T> {
  return async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    const data = await response.json();
    // Check if response is an error object
    if (data && typeof data === 'object' && 'error' in data) {
      throw new Error(data.error || errorMessage);
    }
    return data;
  };
}

/**
 * Creates a parameterized fetch function with error handling
 */
export function createParamFetchFn<T>(
  getEndpoint: (param: string) => string,
  errorMessage: string
): (param: string) => Promise<T> {
  return async (param: string) => {
    const endpoint = getEndpoint(param);
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    // Check if response is an error object
    if (data && typeof data === 'object' && 'error' in data) {
      console.error("Error in API response:", data.error);
      throw new Error(data.error || errorMessage);
    }
    return data;
  };
}

