"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  verifyEmailSchema,
  type VerifyEmailValues,
} from "@/lib/validations/auth/verify-email.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
    },
  });

  async function onSubmit(data: VerifyEmailValues) {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: data.email,
      otp: data.otp,
    });

    if (error) {
      toast.error(error.message || "Verification failed");
    } else {
      toast.success("Email verified successfully!");
      router.push("/");
    }
  }

  async function handleResendOTP() {
    if (!email) {
      toast.error("Email address is required");
      return;
    }

    setIsResending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      toast.error(error.message || "Failed to send verification code");
    } else {
      toast.success("Verification code sent!");
    }
    setIsResending(false);
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              We&apos;ll send a verification code to this email address.
            </FieldDescription>
          </Field>

          <Field data-invalid={!!errors.otp}>
            <FieldLabel htmlFor="otp">Verification code</FieldLabel>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              autoComplete="one-time-code"
              {...register("otp")}
              aria-invalid={!!errors.otp}
              disabled={isSubmitting}
            />
            {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
            <FieldDescription>
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>

          <LoadingButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
            loadingText="Verifying..."
          >
            Verify Email
          </LoadingButton>

          <div className="space-y-2 text-center">
            <p className="text-muted-foreground text-sm">
              Didn&apos;t receive the code?
            </p>
            <LoadingButton
              type="button"
              variant="outline"
              className="w-full"
              loading={isResending}
              loadingText="Sending..."
              onClick={handleResendOTP}
              disabled={!email}
            >
              Resend Code
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
