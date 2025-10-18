import { Suspense } from "react";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { RoomComponent } from "./RoomComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/auth";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  const { id: roomId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
          <RoomComponent roomId={roomId} user={user as User} />
        </Suspense>
      </div>
    </div>
  );
}
