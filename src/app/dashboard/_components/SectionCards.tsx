"use client";

import {
  IconTrophy,
  IconClock,
  IconDeviceGamepad,
  IconFriends,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStats } from "@/hooks/queries/use-user-stats";

export function SectionCards() {
  const { data: stats, isPending } = useUserStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return "text-green-600";
    if (winRate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Only show loader if there's truly no data (first load)
  if (isPending && !stats) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Games Played */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Games Played</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(stats.gamesPlayed)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconDeviceGamepad className="size-3" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.weeklyGames} games this week{" "}
            <IconDeviceGamepad className="size-4" />
          </div>
          <div className="text-muted-foreground">Your gaming activity</div>
        </CardFooter>
      </Card>

      {/* Win Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Win Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.winRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={getWinRateColor(stats.winRate)}>
              <IconTrophy className="size-3" />
              {stats.winRate >= 70
                ? "Excellent"
                : stats.winRate >= 50
                  ? "Good"
                  : "Keep Going"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Victory percentage <IconTrophy className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Your competitive performance
          </div>
        </CardFooter>
      </Card>

      {/* Friends Online */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Friends Online</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(stats.friendsOnline)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFriends className="size-3" />
              Active Now
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ready to party <IconFriends className="size-4" />
          </div>
          <div className="text-muted-foreground">Available for games</div>
        </CardFooter>
      </Card>

      {/* Hours Played */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Hours Played</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(stats.hoursPlayed)}h
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3" />
              Total Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Time in party rooms <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">Your playtime commitment</div>
        </CardFooter>
      </Card>
    </div>
  );
}
