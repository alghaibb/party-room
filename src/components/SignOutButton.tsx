"use client";

import { toast } from "sonner";
import { LoadingButton } from "./LoadingButton";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  async function handleLogout() {
    setIsSubmitting(true);

    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Failed to logout");
    } else {
      toast.success("Logged out successfully");
      router.push("/sign-in");
      router.refresh();
    }

    setIsSubmitting(false);
  }
  return (
    <LoadingButton
      loading={isSubmitting}
      loadingText="Signing out..."
      disabled={isSubmitting}
      onClick={handleLogout}
    >
      Sign out
    </LoadingButton>
  );
}
