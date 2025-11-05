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
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-2xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
                <IconHome className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <IconUsers className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
              Create Party Room
            </h1>
            <p className="text-muted-foreground text-lg">
              Set up your room and start inviting friends to play
            </p>
          </div>
        </div>

        {/* Room Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSettings className="w-5 h-5" />
              Room Settings
            </CardTitle>
            <CardDescription>
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
