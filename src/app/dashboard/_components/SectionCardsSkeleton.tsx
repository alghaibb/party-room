import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCardsSkeleton() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Skeleton Card 1 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-8 w-16" />
          </CardTitle>
          <CardAction>
            <Skeleton className="h-6 w-20" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-3 w-28" />
          </div>
        </CardFooter>
      </Card>

      {/* Skeleton Card 2 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-4 w-20" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-8 w-14" />
          </CardTitle>
          <CardAction>
            <Skeleton className="h-6 w-18" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-3 w-32" />
          </div>
        </CardFooter>
      </Card>

      {/* Skeleton Card 3 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-4 w-28" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-8 w-12" />
          </CardTitle>
          <CardAction>
            <Skeleton className="h-6 w-22" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-26" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-3 w-30" />
          </div>
        </CardFooter>
      </Card>

      {/* Skeleton Card 4 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-4 w-26" />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Skeleton className="h-8 w-20" />
          </CardTitle>
          <CardAction>
            <Skeleton className="h-6 w-24" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Skeleton className="h-4 w-30" />
          </div>
          <div className="text-muted-foreground">
            <Skeleton className="h-3 w-34" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
