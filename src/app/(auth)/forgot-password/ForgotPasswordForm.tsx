"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth/forgot-password.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordValues) {
    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      toast.success(
        "If you have an account with us, we'll send you a reset link.",
      );
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
            <FieldDescription>
              We'll send you a password reset link if an account exists.
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
            loadingText="Sending reset email..."
            disabled={!isValid}
          >
            Send reset email
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
