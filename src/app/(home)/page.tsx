import { SignOutButton } from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      {user ? (
        <SignOutButton />
      ) : (
        <Button asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
