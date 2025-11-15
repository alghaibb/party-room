"use client";

import { LoadingButton } from "./LoadingButton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";
import { toast } from "sonner";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSignOut() {
    setIsLoading(true);
    // Prefetch sign-in page for instant navigation
    startTransition(() => {
      router.prefetch("/sign-in");
    });
    
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Signed out successfully");
      // Use startTransition for non-urgent navigation
      startTransition(() => {
        router.push("/sign-in");
      });
      setIsLoading(false);
    }
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
