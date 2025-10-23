import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ProfileOverview } from "./ProfileOverview";
import { ProfileForm } from "./ProfileForm";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account settings and preferences",
};

export default async function ProfilePage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch password change date on the server
  let passwordChangedAt: string | null = null;
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        password: { not: null },
      },
      select: {
        passwordChangedAt: true,
        createdAt: true,
      },
    });

    if (account) {
      passwordChangedAt = (
        account.passwordChangedAt || account.createdAt
      ).toISOString();
    }
  } catch (error) {
    console.error("Failed to fetch password change date:", error);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Overview - Server Component */}
        <ProfileOverview user={user} />

        {/* Profile Settings - Client Component */}
        <ProfileForm user={user} passwordChangedAt={passwordChangedAt} />
      </div>
    </div>
  );
}
