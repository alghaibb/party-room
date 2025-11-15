import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { CreateRoomForm } from "./CreateRoomForm";
import { IconHome, IconUsers, IconSettings } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Party Room",
  description: "Create a new party room",
};

export default async function CreateRoomPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  if (session.user.emailVerified && !session.user.hasOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-6 max-w-2xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-[linear-gradient(135deg,var(--primary),var(--accent))] rounded-3xl flex items-center justify-center shadow-2xl">
                <IconHome className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <IconUsers className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              <span className="block">Create</span>
              <span className="block bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
                Party Room
              </span>
            </h1>
            <p className="text-lg text-muted-foreground/80">
              Set up your room and start inviting friends to play
            </p>
          </div>
        </div>

        {/* Room Creation Form */}
        <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <IconSettings className="w-6 h-6 text-primary" />
              Room Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Configure your party room preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateRoomForm />
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>
            🎮 Your room will be created instantly and you&apos;ll be the first
            member
          </p>
          <p>
            🔗 Share the room code with friends or keep it public for anyone to
            join
          </p>
        </div>
      </div>
    </div>
  );
}
