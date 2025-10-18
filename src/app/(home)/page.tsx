import { SignOutButton } from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  // Get available rooms
  const rooms = await prisma.room.findMany({
    where: {
      isPrivate: false,
    },
    include: {
      _count: {
        select: { members: true }
      },
      creator: {
        select: { displayUsername: true, name: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Party Room</h1>
            <p className="text-white/80 text-lg">Real-time chat and gaming</p>
          </div>
          <Button asChild size="lg">
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Party Room</h1>
          <p className="text-white/80">Welcome back, {user.displayUsername || user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Room */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Create Room</CardTitle>
              <CardDescription>Start a new party room for chatting and games</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/create-room">Create New Room</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Available Rooms */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
              <CardDescription>Join existing rooms to chat and play games</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No rooms available yet. Create the first one!
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created by {room.creator.displayUsername || room.creator.name} • {room._count.members} members
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/room/${room.id}`}>Join</Link>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="text-center mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
