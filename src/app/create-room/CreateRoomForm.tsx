"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  createRoomSchema,
  type CreateRoomValues,
} from "@/lib/validations/room.schema";
import { toast } from "sonner";
import { LoadingButton } from "@/components/LoadingButton";
import Link from "next/link";

interface CreateRoomFormProps {
  userId: string;
}

export function CreateRoomForm({ userId }: CreateRoomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      isPrivate: false,
      maxMembers: 10,
    },
  });

  const isPrivate = watch("isPrivate");

  async function onSubmit(data: CreateRoomValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          createdBy: userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create room");
      }

      const room = await response.json();
      toast.success("Room created successfully!");

      // Redirect to the new room
      router.push(`/room/${room.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Room Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Enter room name"
              autoComplete="off"
              {...register("name")}
              aria-invalid={!!errors.name}
              disabled={isSubmitting}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
            <FieldDescription>
              Choose a fun name for your party room
            </FieldDescription>
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe your room..."
              className="min-h-[80px]"
              {...register("description")}
              aria-invalid={!!errors.description}
              disabled={isSubmitting}
            />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
            <FieldDescription>
              Tell others what this room is about
            </FieldDescription>
          </Field>

          <Field data-invalid={!!errors.maxMembers}>
            <FieldLabel htmlFor="maxMembers">Maximum Members</FieldLabel>
            <Input
              id="maxMembers"
              type="number"
              min="2"
              max="50"
              placeholder="10"
              {...register("maxMembers", { valueAsNumber: true })}
              aria-invalid={!!errors.maxMembers}
              disabled={isSubmitting}
            />
            {errors.maxMembers && <FieldError>{errors.maxMembers.message}</FieldError>}
            <FieldDescription>
              How many people can join (2-50)
            </FieldDescription>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="isPrivate"
              {...register("isPrivate")}
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <FieldLabel htmlFor="isPrivate" className="font-normal">
                Private Room
              </FieldLabel>
              <FieldDescription>
                Private rooms are invite-only and won't appear in the public room list
              </FieldDescription>
            </div>
          </Field>

          <div className="flex gap-3">
            <LoadingButton
              type="submit"
              className="flex-1"
              loading={isSubmitting}
              loadingText="Creating..."
              disabled={!isValid}
            >
              Create Room
            </LoadingButton>

            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
