"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconMail, IconX, IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";

interface VerificationBannerProps {
  userEmail: string;
}

export function VerificationBanner({ userEmail }: VerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 mx-4 lg:mx-6 mt-4">
      <div className="flex items-center gap-4 p-4">
        <div className="shrink-0">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <IconMail className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Please Verify Your Email
            </h3>
            <Badge
              variant="outline"
              className="border-amber-300 text-amber-700 dark:border-amber-600 dark:text-amber-300"
            >
              <IconAlertTriangle className="w-3 h-3 mr-1" />
              Limited Access
            </Badge>
          </div>

          <p className="text-sm text-amber-800 dark:text-amber-200">
            Verify <strong>{userEmail}</strong> to unlock all Party Room
            features including creating rooms, joining games, and adding
            friends.
          </p>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Link href="/verify-email">
                <IconMail className="w-4 h-4" />
                Verify Email
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
            >
              <IconX className="w-4 h-4" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
