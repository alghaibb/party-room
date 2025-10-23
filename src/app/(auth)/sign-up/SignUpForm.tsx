"use client";

import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  signUpSchema,
  type SignUpValues,
} from "@/lib/validations/auth/sign-up.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const methods = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const { isChecking: isCheckingUsername } = useUsernameCheck({
    watch,
    setError,
    clearErrors,
  });

  async function onSubmit(data: SignUpValues) {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username,
      displayUsername: data.displayUsername,
    });

    if (error) {
      toast.error(error.message || "Sign up failed");
    } else {
      toast.success("Account created! Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    }
  }

  async function handleSocialLogin(provider: string) {
    setIsSocialLoading(true);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirectTo || "/",
    });

    if (error) {
      toast.error(error.message || "Sign up failed");
    } else {
      toast.success("Signed up successfully");
      router.push(redirectTo || "/");
    }
    setIsSocialLoading(false);
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
              <FieldDescription>
                We will not display your full name to other users.
              </FieldDescription>
            </Field>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col gap-2">
                <Field data-invalid={!!errors.username}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                    {...register("username")}
                    aria-invalid={!!errors.username}
                    disabled={isSubmitting}
                  />
                  {errors.username && (
                    <FieldError>{errors.username.message}</FieldError>
                  )}
                  <FieldDescription>
                    This will be used to identify you on the platform.
                    {isCheckingUsername && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        Checking availability...
                      </span>
                    )}
                  </FieldDescription>
                </Field>
              </div>

              <div className="flex flex-col gap-2">
                <Field data-invalid={!!errors.displayUsername}>
                  <FieldLabel htmlFor="displayUsername">
                    Display username
                  </FieldLabel>
                  <Input
                    id="displayUsername"
                    type="text"
                    placeholder="Enter your display username"
                    autoComplete="username"
                    {...register("displayUsername")}
                    aria-invalid={!!errors.displayUsername}
                    disabled={isSubmitting}
                  />
                  {errors.displayUsername && (
                    <FieldError>{errors.displayUsername.message}</FieldError>
                  )}

                  <FieldDescription>
                    This will be shown to other users. If left empty, your
                    username will be used.
                  </FieldDescription>
                </Field>
              </div>
            </div>

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
                We&apos;ll never share your email with anyone else.
              </FieldDescription>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="Create a password"
                autoComplete="new-password"
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

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
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
              loadingText="Signing up..."
              disabled={!isValid}
            >
              Sign up
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
        </FormProvider>
      </CardContent>
    </Card>
  );
}
