"use client";

import { LoadingButton } from "./LoadingButton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSignOut() {
    setIsLoading(true);
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
    setIsLoading(false);
  }

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={onSignOut}
      loadingText="Signing out..."
      type="button"
      className={className}
    >
      Sign out
    </LoadingButton>
  );
}
