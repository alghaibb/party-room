import { apiHandlerWithParams } from "@/lib/api-handler";
import { roomMessagesService } from "@/services/room";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  return apiHandlerWithParams(
    params,
    ({ roomId }) => roomMessagesService.getRoomMessages(roomId),
    "Failed to fetch room messages"
  );
}

