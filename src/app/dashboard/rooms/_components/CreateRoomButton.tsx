"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface CreateRoomButtonProps {
  isVerified?: boolean;
}

export function CreateRoomButton({ isVerified = true }: CreateRoomButtonProps) {
  return (
    <Button
      asChild={isVerified}
      disabled={!isVerified}
      title={!isVerified ? "Please verify your email to create rooms" : ""}
      size="sm"
    >
      {isVerified ? (
        <Link href="/dashboard/rooms/create">
          <IconPlus className="w-4 h-4" />
          Create Room
        </Link>
      ) : (
        <>
          <IconPlus className="w-4 h-4" />
          Create Room
        </>
      )}
    </Button>
  );
}
