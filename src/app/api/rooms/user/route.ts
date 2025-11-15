import { getUserRooms } from "@/app/dashboard/rooms/data";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getUserRooms(),
    "Failed to fetch user rooms"
  );
}

