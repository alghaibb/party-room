import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { User as UserType } from "@/lib/auth";

interface ProfileOverviewProps {
  user: UserType;
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="md:col-span-1">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="mt-4">{user.name}</CardTitle>
        <CardDescription>
          {user.displayUsername && `@${user.displayUsername}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-muted-foreground h-4 w-4" />
          <div className="flex items-center gap-2">
            <span className="text-sm">{user.email}</span>
            {user.emailVerified ? (
              <Badge variant="secondary" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Unverified
              </Badge>
            )}
          </div>
        </div>
        {user.username && (
          <div className="flex items-center gap-3">
            <User className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">@{user.username}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
