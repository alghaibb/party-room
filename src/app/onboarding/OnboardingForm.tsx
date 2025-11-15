"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  onboardingSchema,
  OnboardingData,
} from "@/lib/validations/user/onboarding.schema";
import { useUsernameAvailability } from "@/hooks/use-username-availability";
import { completeOnboarding } from "@/app/onboarding/actions";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface OnboardingFormProps {
  userName?: string;
}

export function OnboardingForm({ userName }: OnboardingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: userName || "",
      username: "",
    },
  });

  const watchedUsername = form.watch("username");
  const watchedImage = form.watch("image");

  const {
    isAvailable,
    isChecking,
    error: usernameError,
    message: usernameMessage,
    checkUsername,
  } = useUsernameAvailability();

  // Check username availability when username changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    form.setValue("username", username);
    if (username.length >= 3) {
      checkUsername(username);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(data: OnboardingData) {
    if (isChecking) return;

    if (watchedUsername && isAvailable === false) {
      return; // Don't submit if username is not available
    }

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("displayName", data.displayName);

      if (data.image) {
        formData.append("image", data.image);
      }

      const result = await completeOnboarding(formData);

      if (!result?.success) {
        toast.error(result?.message || "Failed to complete onboarding");
        return;
      }

      toast.success(
        "Welcome to Party Room! Your profile has been set up successfully."
      );
      router.push("/");
    } catch (error) {
      console.error("Error submitting onboarding form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername.length < 3) return null;
    if (isChecking) return "Checking availability...";
    if (usernameError) return usernameError;
    if (usernameMessage) return usernameMessage;
    return null;
  };

  const getUsernameStatusColor = () => {
    if (isChecking) return "text-yellow-600";
    if (usernameError) return "text-red-600";
    if (isAvailable === true) return "text-green-600";
    if (isAvailable === false) return "text-red-600";
    return "text-gray-600";
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col items-center space-y-4 pb-2">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={previewImage || undefined} />
                <AvatarFallback className="text-lg font-semibold bg-linear-to-br from-primary/10 to-secondary/10">
                  {userName?.slice(0, 2)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {previewImage && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-3 h-3 text-background"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="text-sm hover:bg-primary/5"
              >
                {watchedImage ? "Change Photo" : "Upload Photo"}
              </Button>

              {watchedImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  Remove Photo
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {form.formState.errors.image && (
              <p className="text-sm text-destructive">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your username"
                    onChange={handleUsernameChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
                {getUsernameStatus() && (
                  <p className={`text-sm ${getUsernameStatusColor()}`}>
                    {getUsernameStatus()}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your display name"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loadingText="Setting up your profile..."
            isLoading={isLoading}
            disabled={
              isLoading ||
              isChecking ||
              (!!watchedUsername && isAvailable === false)
            }
            className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Complete Setup
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
