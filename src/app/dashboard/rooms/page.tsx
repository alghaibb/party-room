import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/get-session";
import { RoomsContent } from "./_components/RoomsContent";
import { CreateRoomButton } from "./_components/CreateRoomButton";
import { JoinRoomTrigger } from "../_components/JoinRoomTrigger";
import { RoomGridSkeleton } from "./_components/RoomGridSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Rooms",
};

function RoomsContentSkeleton() {
  return (
    <>
      {/* Room Stats Skeleton */}
      <div className="h-20 animate-pulse bg-muted rounded-lg" />

      {/* User Rooms Skeleton */}
      <div className="space-y-4">
        <div className="h-32 animate-pulse bg-muted rounded-lg" />
      </div>

      {/* Available Rooms Grid Skeleton */}
      <div className="space-y-4">
        <RoomGridSkeleton />
      </div>
    </>
  );
}

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

        <Suspense fallback={<RoomsContentSkeleton />}>
          <RoomsContent />
        </Suspense>
      </div>
    </div>
  );
}
