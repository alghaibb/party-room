import { getAvailableGames } from "@/app/dashboard/rooms/[roomId]/data";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getAvailableGames(),
    "Failed to fetch available games"
  );
}

