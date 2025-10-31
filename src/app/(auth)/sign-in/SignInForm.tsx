"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  SignInData,
} from "@/lib/validations/auth/sign-in.schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: SignInData) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully");
      router.push(redirectTo ?? "/dashboard");
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <div className="grid gap-1.5 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Remember me
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loadingText="Signing in..."
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Sign in
        </LoadingButton>
      </form>
    </Form>
  );
}
