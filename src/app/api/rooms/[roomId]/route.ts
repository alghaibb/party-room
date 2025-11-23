import { roomService } from "@/services/room";
import { apiHandlerWithParams } from "@/lib/api-handler";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return apiHandlerWithParams(
    params,
    ({ roomId }) => roomService.getRoomDetails(roomId),
    "Failed to fetch room details"
  );
}

