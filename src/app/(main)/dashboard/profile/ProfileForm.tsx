"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { profileSchema, ProfileValues } from "@/lib/validations/profile.schema";
import { User } from "@/lib/auth";
import { useChangePasswordModal } from "@/hooks/useModal";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";

interface ProfileFormProps {
  user: User;
  passwordChangedAt?: string | null;
}

export function ProfileForm({ user, passwordChangedAt }: ProfileFormProps) {
  const { open: openChangePasswordModal } = useChangePasswordModal();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user.image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayUsername: user.displayUsername || "",
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      // Refresh the page to get updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size and type
    if (file.size > 4.5 * 1024 * 1024) {
      toast.error("File size must be less than 4.5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("File must be a JPEG, PNG, or WebP image");
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/user/profile/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setPreviewImage(data.imageUrl);
      toast.success("Profile image updated successfully!");

      // Refresh the page to update the overview
      window.location.reload();
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploadingImage(true);
    try {
      const response = await fetch("/api/user/profile/image", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove image");
      }

      setPreviewImage(null);
      toast.success("Profile image removed successfully!");

      // Refresh the page to update the overview
      window.location.reload();
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information and upload a profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Profile Picture</Label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewImage || ""} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {previewImage && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isUploadingImage ? "Uploading..." : "Change Picture"}
                </Button>
                <p className="text-muted-foreground text-xs">
                  JPEG, PNG or WebP. Max 4.5MB.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Information Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayUsername">Display Username</Label>
              <Input
                id="displayUsername"
                {...register("displayUsername")}
                placeholder="Choose a display name"
              />
              {errors.displayUsername && (
                <p className="text-destructive text-sm">
                  {errors.displayUsername.message}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                This is how others will see you in the app
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                {user.username && (
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-muted-foreground text-sm">
                      @{user.username}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Account Created</Label>
                  <p className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Password</Label>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Last changed:{" "}
                    {passwordChangedAt
                      ? new Date(passwordChangedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "Never"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openChangePasswordModal();
                    }}
                  >
                    Change Password
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating || !isDirty}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ChangePasswordModal />
    </>
  );
}
