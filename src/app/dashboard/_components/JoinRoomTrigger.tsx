"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { IconLogin } from "@tabler/icons-react";
import { LoadingButton } from "@/components/LoadingButton";
import { useRoomActions } from "@/hooks/use-room-actions";
import {
  joinRoomSchema,
  JoinRoomData,
} from "@/lib/validations/room/room.schema";

interface JoinRoomTriggerProps {
  isVerified?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
}

export function JoinRoomTrigger({
  isVerified = true,
  variant = "outline",
  size = "default",
  className,
}: JoinRoomTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading, handleJoinRoom } = useRoomActions();

  // Ensure Dialog only renders after hydration to avoid ID mismatches
  useEffect(() => {
    // Use setTimeout to defer setState and avoid React Compiler warning
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<JoinRoomData>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomCode: "",
    },
  });

  async function onSubmit(data: JoinRoomData) {
    if (!isVerified) {
      return;
    }

    const success = await handleJoinRoom(data.roomCode);
    if (success) {
      setIsOpen(false);
      form.reset();
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  // Render button only during SSR, full Dialog after client mount
  if (!isMounted) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={!isVerified}
        title={!isVerified ? "Please verify your email to join rooms" : ""}
        className={className}
      >
        <IconLogin className="w-4 h-4" />
        Join Room
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="modern-outline"
          size={size === "sm" ? "modern-sm" : "modern-md"}
          disabled={!isVerified}
          title={!isVerified ? "Please verify your email to join rooms" : ""}
          className={className}
        >
          <IconLogin className="w-4 h-4" />
          Join Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Join Party Room</DialogTitle>
              <DialogDescription>
                Enter the 6-digit room code to join an existing party room.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="roomCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ABC123"
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                      }}
                      maxLength={6}
                      className="text-center text-lg font-mono tracking-widest"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="modern-outline"
                size="modern-sm"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Joining..."
                disabled={isLoading || !isVerified}
                variant="modern"
                size="modern-sm"
              >
                Join Room
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
