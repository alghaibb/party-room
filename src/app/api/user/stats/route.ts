import { getUserStats } from "@/app/dashboard/data";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getUserStats(),
    "Failed to fetch user stats"
  );
}

