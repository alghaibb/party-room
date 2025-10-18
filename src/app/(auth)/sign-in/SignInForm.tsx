"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  signInSchema,
  type SignInValues,
} from "@/lib/validations/auth/sign-in.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const emailOrUsername = watch("email");

  async function onSubmit(data: SignInValues) {
    let error;

    // Check if input looks like an email (contains @)
    const isEmail = emailOrUsername?.includes("@");

    if (isEmail) {
      // Sign in with email
      const result = await authClient.signIn.email({
        email: data.email!,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      error = result.error;
    } else {
      // Sign in with username
      const result = await authClient.signIn.username({
        username: data.email!,
        password: data.password,
      });
      error = result.error;
    }

    if (error) {
      toast.error(error.message || "Sign in failed");
    } else {
      toast.success("Signed in successfully");
      router.push(redirectTo || "/");
    }
  }

  async function handleSocialLogin(provider: string) {
    setIsSocialLoading(true);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirectTo || "/",
    });

    if (error) {
      toast.error(error.message || "Sign in failed");
    } else {
      toast.success("Signed in successfully");
      router.push(redirectTo || "/");
    }
    setIsSocialLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email address or username</FieldLabel>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              autoComplete="username"
              {...register("email")}
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
            <FieldDescription>
              Enter your email address or username to sign in.
            </FieldDescription>
          </Field>

          <Field data-invalid={!!errors.password}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Button variant="link" size="sm" asChild>
                <Link href="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="remember" disabled={isSubmitting} />
            <FieldLabel htmlFor="remember" className="font-normal">
              Remember me
            </FieldLabel>
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
            loadingText="Signing in..."
            disabled={!isValid}
          >
            Sign in
          </LoadingButton>
          <FieldSeparator className="my-4">Or continue with</FieldSeparator>

          <div className="flex flex-col gap-2">
            <LoadingButton
              variant="outline"
              className="w-full"
              loading={isSocialLoading}
              loadingText="Loading..."
              disabled={isSocialLoading}
              onClick={() => handleSocialLogin("google")}
            >
              <FaGoogle className="size-4" />
              Continue with Google
            </LoadingButton>
            <LoadingButton
              variant="outline"
              className="w-full"
              loading={isSocialLoading}
              loadingText="Loading..."
              disabled={isSocialLoading}
              onClick={() => handleSocialLogin("facebook")}
            >
              <FaFacebook className="size-4" />
              Continue with Facebook
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
