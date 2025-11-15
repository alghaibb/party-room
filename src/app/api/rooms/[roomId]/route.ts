import { getRoomDetails } from "@/app/dashboard/rooms/[roomId]/data";
import { apiHandlerWithParams } from "@/lib/api-handler";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return apiHandlerWithParams(
    params,
    ({ roomId }) => getRoomDetails(roomId),
    "Failed to fetch room details"
  );
}

