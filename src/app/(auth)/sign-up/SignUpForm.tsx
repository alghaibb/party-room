"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signUpSchema,
  SignUpData,
} from "@/lib/validations/auth/sign-up.schema";
import { LoadingButton } from "@/components/LoadingButton";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { startTransition } from "react";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpData) {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Account created successfully! Please check your email for verification."
      );
      const params = new URLSearchParams();
      params.set("email", data.email);
      if (redirectTo) {
        params.set("redirectTo", redirectTo);
      }
      const verifyPath = `/verify-email?${params.toString()}`;
      // Prefetch and navigate with startTransition for instant navigation
      startTransition(() => {
        router.prefetch(verifyPath);
        router.push(verifyPath);
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loadingText="Creating account..."
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
