"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRoomSchema,
  CreateRoomData,
} from "@/lib/validations/room/room.schema";
import { ROOM_CONSTANTS } from "@/constants/room";
import { createRoom } from "./actions";
import { LoadingButton } from "@/components/LoadingButton";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export function CreateRoomForm() {
  const router = useRouter();

  const form = useForm<CreateRoomData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      maxPlayers: ROOM_CONSTANTS.DEFAULT_MAX_PLAYERS,
      isPublic: true,
    } as CreateRoomData,
  });

  async function onSubmit(data: CreateRoomData) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("maxPlayers", data.maxPlayers.toString());
      formData.append("isPublic", data.isPublic.toString());

      const result = await createRoom(formData);

      if (!result?.success) {
        toast.error(result?.message || "Failed to create room");
        return;
      }

      toast.success(`Room created successfully! Code: ${result.roomCode} 🎉`);
      // Prefetch and navigate with startTransition for instant navigation
      const roomPath = `/dashboard/rooms/${result.roomId}`;
      startTransition(() => {
        router.prefetch(roomPath);
        router.push(roomPath);
      });
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Room Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Friday Night Fun"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell people what your party room is about..."
                  rows={3}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional - Help others understand what kind of games you&apos;ll
                play
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Players */}
        <FormField
          control={form.control}
          name="maxPlayers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Players</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={ROOM_CONSTANTS.MIN_PLAYERS}
                  max={ROOM_CONSTANTS.MAX_PLAYERS}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      parseInt(e.target.value) ||
                        ROOM_CONSTANTS.DEFAULT_MAX_PLAYERS
                    )
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Choose how many people can join your room (
                {ROOM_CONSTANTS.MIN_PLAYERS}-{ROOM_CONSTANTS.MAX_PLAYERS}{" "}
                players)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Setting */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Room</FormLabel>
                <FormDescription>
                  {field.value
                    ? "Anyone can discover and join your room"
                    : "Only people with the room code can join"}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <LoadingButton
          loadingText="Creating room..."
          isLoading={isLoading}
          disabled={isLoading}
          variant="modern"
          size="modern-md"
          className="w-full"
        >
          Create Party Room
        </LoadingButton>
      </form>
    </Form>
  );
}
