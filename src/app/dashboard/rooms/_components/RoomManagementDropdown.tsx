"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconDots, IconTrash, IconEdit, IconShare } from "@tabler/icons-react";
import { useModalStore } from "@/stores/modal-store";
import { useRoomActions } from "@/hooks/use-room-actions";
import { LoadingButton } from "@/components/LoadingButton";
import { toast } from "sonner";

interface RoomManagementDropdownProps {
  roomId: string;
  roomName: string;
  roomCode: string;
  isOwner: boolean;
}

export function RoomManagementDropdown({
  roomId,
  roomName,
  roomCode,
  isOwner,
}: RoomManagementDropdownProps) {
  const { deleteRoomOpen, openDeleteRoom, closeDeleteRoom } = useModalStore();
  const { isLoading, handleDeleteRoom } = useRoomActions();

  if (!isOwner) {
    return null; // Don't show dropdown for non-owners
  }

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success(`Room code ${roomCode} copied to clipboard!`);
  };

  const handleDeleteClick = () => {
    openDeleteRoom();
  };

  const handleDeleteConfirm = async () => {
    const success = await handleDeleteRoom(roomId);
    if (success) {
      closeDeleteRoom();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-70 hover:opacity-100"
          >
            <IconDots className="h-4 w-4" />
            <span className="sr-only">Room options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyRoomCode}>
            <IconShare className="mr-2 h-4 w-4" />
            Copy Room Code
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Room
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20"
            onClick={handleDeleteClick}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete Room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteRoomOpen} onOpenChange={closeDeleteRoom}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>&quot;{roomName}&quot;</strong>? This action cannot be
              undone and all players will be removed from the room.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <LoadingButton
              onClick={handleDeleteConfirm}
              isLoading={isLoading}
              loadingText="Deleting..."
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Room
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
