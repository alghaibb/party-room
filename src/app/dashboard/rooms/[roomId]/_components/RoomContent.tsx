import { getRoomDetails, getAvailableGames, getRoomMessages } from "../data";
import { RoomHeader } from "./RoomHeader";
import { PlayerList } from "./PlayerList";
import { GameArea } from "./GameArea";
import { ChatArea } from "./ChatArea";
import { getSession } from "@/lib/get-session";

interface RoomContentProps {
  roomId: string;
}

export async function RoomContent({ roomId }: RoomContentProps) {
  const session = await getSession();
  const room = await getRoomDetails(roomId);
  const availableGames = await getAvailableGames();
  const dbMessages = await getRoomMessages(room.id);

  const initialMessages = dbMessages.map(
    (msg: {
      id: string;
      content: string;
      user: { id: string; name: string };
      createdAt: Date;
    }) => ({
      id: msg.id,
      content: msg.content,
      user: {
        id: msg.user.id,
        name: msg.user.name,
      },
      createdAt: msg.createdAt.toISOString(),
    })
  );

  return (
    <>
      <div className="lg:w-80 flex flex-col gap-4">
        <RoomHeader room={room} />

        <div className="flex-1">
          <PlayerList
            roomId={room.id}
            members={room.members.map((m: (typeof room.members)[0]) => ({
              ...m,
              user: {
                ...m.user,
                displayUsername:
                  (
                    m.user as typeof m.user & {
                      displayUsername: string | null;
                    }
                  ).displayUsername || m.user.name,
              },
            }))}
            owner={{
              ...room.owner,
              displayUsername:
                (
                  room.owner as typeof room.owner & {
                    displayUsername: string | null;
                  }
                ).displayUsername || room.owner.name,
            }}
            maxPlayers={room.maxPlayers}
            currentUserId={session!.user.id}
            currentUserName={session!.user.name}
            currentUserDisplayUsername={
              session!.user.displayUsername || session!.user.name
            }
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0 has-[.chat-minimized]:gap-0">
        <div className="flex-1 min-h-0 has-[~_.chat-minimized]:flex-none has-[~_.chat-minimized]:h-full">
          <GameArea room={room} availableGames={availableGames} />
        </div>
        <div className="shrink-0">
          <ChatArea
            roomId={room.id}
            roomName={room.name}
            currentUserId={session!.user.id}
            currentUserName={session!.user.name}
            currentUserDisplayUsername={
              session!.user.displayUsername || session!.user.name
            }
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </>
  );
}
