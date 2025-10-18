import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // This endpoint is used for CORS preflight and basic connection check
  // The actual Socket.io server is initialized in a custom server setup

  return new Response(JSON.stringify({ status: "Socket.io server ready" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
