import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { RoomGrid } from "./_components/RoomGrid";
import { RoomStats } from "./_components/RoomStats";
import { UserRooms } from "./_components/UserRooms";
import { CreateRoomButton } from "./_components/CreateRoomButton";
import { JoinRoomTrigger } from "../_components/JoinRoomTrigger";
import { Suspense } from "react";
import { RoomGridSkeleton } from "./_components/RoomGridSkeleton";

export default async function RoomsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.emailVerified && !session.user.hasOnboarded) {
    redirect("/onboarding");
  }

  const isVerified = session.user.emailVerified;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight">Party Rooms</h1>
              <p className="text-muted-foreground">
                Join active rooms or create your own party
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <JoinRoomTrigger isVerified={isVerified} size="sm" />
              <CreateRoomButton isVerified={isVerified} />
            </div>
          </div>
        </div>

        {/* Room Statistics */}
        <Suspense
          fallback={<div className="h-20 animate-pulse bg-muted rounded-lg" />}
        >
          <RoomStats />
        </Suspense>

        {/* User's Recent Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Recent Rooms</h2>
          </div>
          <Suspense
            fallback={
              <div className="h-32 animate-pulse bg-muted rounded-lg" />
            }
          >
            <UserRooms />
          </Suspense>
        </div>

        {/* Active Public Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Rooms</h2>
            <p className="text-sm text-muted-foreground">
              Join any public room to start playing
            </p>
          </div>
          <Suspense fallback={<RoomGridSkeleton />}>
            <RoomGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
