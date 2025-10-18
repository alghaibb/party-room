"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth/reset-password.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
      return;
    }
    setIsValidatingToken(false);
  }, [token, router]);

  async function onSubmit(data: ResetPasswordValues) {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    const { error } = await authClient.resetPassword({
      token,
      newPassword: data.password.password,
    });

    if (error) {
      toast.error(error.message || "Failed to reset password");
    } else {
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    }
  }

  if (isValidatingToken) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Validating reset token...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.password?.password}>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              {...register("password.password")}
              aria-invalid={!!errors.password?.password}
              disabled={isSubmitting}
            />
            {errors.password?.password && (
              <FieldError>{errors.password.password.message}</FieldError>
            )}
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field data-invalid={!!errors.password?.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              {...register("password.confirmPassword")}
              aria-invalid={!!errors.password?.confirmPassword}
              disabled={isSubmitting}
            />
            {errors.password?.confirmPassword && (
              <FieldError>{errors.password.confirmPassword.message}</FieldError>
            )}
            <FieldDescription>
              Re-enter your password to confirm.
            </FieldDescription>
          </Field>

          {errors.root && (
            <FieldError className="text-center">
              {errors.root.message}
            </FieldError>
          )}

          <LoadingButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
            loadingText="Resetting password..."
            disabled={!isValid}
          >
            Reset password
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
