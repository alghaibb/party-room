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
  const { data: stats } = useUserStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return "text-green-600";
    if (winRate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Show loader only when there's no cached data (first load)
  if (stats === undefined) {
    return (
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardHeader className="pb-4">
              <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
              <div className="h-10 w-20 bg-muted/50 animate-pulse rounded mt-3" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Games Played */}
      <Card className="@container/card rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="pb-4">
          <CardDescription className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Games Played
          </CardDescription>
          <CardTitle className="text-3xl font-black tabular-nums @[250px]/card:text-4xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {formatNumber(stats.gamesPlayed)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-full border-foreground/20">
              <IconDeviceGamepad className="size-3" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-semibold">
            {stats.weeklyGames} games this week{" "}
            <IconDeviceGamepad className="size-4" />
          </div>
          <div className="text-muted-foreground/80">Your gaming activity</div>
        </CardFooter>
      </Card>

      {/* Win Rate */}
      <Card className="@container/card rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="pb-4">
          <CardDescription className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Win Rate
          </CardDescription>
          <CardTitle className={`text-3xl font-black tabular-nums @[250px]/card:text-4xl ${getWinRateColor(stats.winRate)}`}>
            {stats.winRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={`rounded-full border-foreground/20 ${getWinRateColor(stats.winRate)}`}>
              <IconTrophy className="size-3" />
              {stats.winRate >= 70
                ? "Excellent"
                : stats.winRate >= 50
                  ? "Good"
                  : "Keep Going"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-semibold">
            Victory percentage <IconTrophy className="size-4" />
          </div>
          <div className="text-muted-foreground/80">
            Your competitive performance
          </div>
        </CardFooter>
      </Card>

      {/* Friends Online */}
      <Card className="@container/card rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="pb-4">
          <CardDescription className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Friends Online
          </CardDescription>
          <CardTitle className="text-3xl font-black tabular-nums @[250px]/card:text-4xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {formatNumber(stats.friendsOnline)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-full border-foreground/20">
              <IconFriends className="size-3" />
              Active Now
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-semibold">
            Ready to party <IconFriends className="size-4" />
          </div>
          <div className="text-muted-foreground/80">Available for games</div>
        </CardFooter>
      </Card>

      {/* Hours Played */}
      <Card className="@container/card rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="pb-4">
          <CardDescription className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Hours Played
          </CardDescription>
          <CardTitle className="text-3xl font-black tabular-nums @[250px]/card:text-4xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {formatNumber(stats.hoursPlayed)}h
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-full border-foreground/20">
              <IconClock className="size-3" />
              Total Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex gap-2 font-semibold">
            Time in party rooms <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground/80">Your playtime commitment</div>
        </CardFooter>
      </Card>
    </div>
  );
}
