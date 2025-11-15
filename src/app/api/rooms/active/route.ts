import { getActiveRooms } from "@/app/dashboard/rooms/data";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getActiveRooms(),
    "Failed to fetch active rooms"
  );
}

