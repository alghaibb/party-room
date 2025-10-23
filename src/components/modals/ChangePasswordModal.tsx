"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/LoadingButton";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "@/lib/validations/auth/change-password.schema";
import { authClient } from "@/lib/auth-client";
import { useChangePasswordModal } from "@/hooks/useModal";

export function ChangePasswordModal() {
  const { isOpen, close } = useChangePasswordModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordValues) {
    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully!");
      reset();
      close();
      // Refresh the page to update the password change date
      window.location.reload();
    }
  }

  const handleClose = () => {
    reset();
    close();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new secure password
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className="space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Field>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <PasswordInput
              id="currentPassword"
              {...register("currentPassword")}
              placeholder="Enter your current password"
              disabled={isSubmitting}
            />
            <FieldError>{errors.currentPassword?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <PasswordInput
              id="newPassword"
              {...register("newPassword")}
              placeholder="Enter your new password"
              disabled={isSubmitting}
            />
            <FieldError>{errors.newPassword?.message}</FieldError>
            <FieldDescription>
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmNewPassword">
              Confirm New Password
            </FieldLabel>
            <PasswordInput
              id="confirmNewPassword"
              {...register("confirmNewPassword")}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
            />
            <FieldError>{errors.confirmNewPassword?.message}</FieldError>
          </Field>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingText="Changing password..."
              disabled={isSubmitting || !isDirty}
            >
              Change Password
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
