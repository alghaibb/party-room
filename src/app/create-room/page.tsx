import { Suspense } from "react";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { CreateRoomForm } from "./CreateRoomForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Room",
  description: "Create a new party room for chatting and gaming",
};

export default async function CreateRoomPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Room</h1>
          <p className="text-white/80">Start a new party room</p>
        </div>

        <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
          <CreateRoomForm userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}
