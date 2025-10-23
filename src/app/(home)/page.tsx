import { SignOutButton } from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-6 text-center">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Party Room</h1>
            <p className="text-lg">Real-time chat and gaming</p>
          </div>
          <Button asChild size="lg">
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Party Room</h1>
          <p>Welcome back, {user.displayUsername || user.name}!</p>
        </div>
        <div className="space-y-4">
          <p>
            Authentication system is ready. Chat and gaming features coming
            soon!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard/profile">Profile</Link>
            </Button>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
