import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { RoomContent } from "./_components/RoomContent";
import { getRoomDetails } from "./data";
import { Metadata } from "next";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { roomId } = await params;

  try {
    const room = await getRoomDetails(roomId);

    return {
      title: room.name,
      description:
        room.description ||
        `Join ${room.name} with ${room.memberCount} ${room.memberCount === 1 ? "player" : "players"}. ${room.isPublic ? "Public room" : "Private room"} hosted by ${room.owner.name}.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Room Not Found",
      description: "This room could not be found or is no longer available.",
    };
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  const { roomId } = await params;

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 h-full min-h-0">
        <RoomContent roomId={roomId} />
      </div>
    </div>
  );
}
