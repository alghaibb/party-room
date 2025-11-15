import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { RoomsContent } from "./_components/RoomsContent";
import { CreateRoomButton } from "./_components/CreateRoomButton";
import { JoinRoomTrigger } from "../_components/JoinRoomTrigger";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Rooms",
};

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
      <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3 min-w-0 flex-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                <span className="block">Party</span>
                <span className="block bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
                  Rooms
                </span>
              </h1>
              <p className="text-lg text-muted-foreground/80">
                Join active rooms or create your own party
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <JoinRoomTrigger isVerified={isVerified} size="sm" />
              <CreateRoomButton isVerified={isVerified} />
            </div>
          </div>
        </div>

        <RoomsContent />
      </div>
    </div>
  );
}
