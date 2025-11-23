import { gameService } from "@/services/game";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => gameService.getAvailableGames(),
    "Failed to fetch available games"
  );
}

