import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RoomLoading() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 h-full min-h-0">
        <div className="lg:w-80 flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Card className="flex-1">
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-80 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col pt-6">
              <div className="flex-1 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
