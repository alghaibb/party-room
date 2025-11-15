import { getSession } from "@/lib/get-session";
import { apiHandler } from "@/lib/api-handler";

export async function GET() {
  return apiHandler(
    () => getSession(),
    "Failed to fetch session"
  );
}

