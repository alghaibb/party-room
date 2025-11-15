import { getRoomStats } from "@/app/dashboard/rooms/data";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getRoomStats(),
    "Failed to fetch room stats"
  );
}

