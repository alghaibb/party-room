import { NextResponse } from "next/server";

/**
 * Wrapper for API route handlers that provides consistent error handling
 * @param handler - The async handler function
 * @param errorMessage - Custom error message to return on failure
 * @returns NextResponse with JSON data or error
 */
export async function apiHandler<T>(
  handler: () => Promise<T>,
  errorMessage: string
): Promise<NextResponse<T | { error: string }>> {
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    console.error(errorMessage, error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Wrapper for API route handlers with dynamic params
 * @param paramsPromise - Promise that resolves to params object
 * @param handler - The async handler function that receives extracted params
 * @param errorMessage - Custom error message to return on failure
 * @returns NextResponse with JSON data or error
 */
export async function apiHandlerWithParams<T, P extends Record<string, string>>(
  paramsPromise: Promise<P>,
  handler: (params: P) => Promise<T>,
  errorMessage: string
): Promise<NextResponse<T | { error: string }>> {
  try {
    const params = await paramsPromise;
    const data = await handler(params);
    return NextResponse.json(data);
  } catch (error) {
    console.error(errorMessage, error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

