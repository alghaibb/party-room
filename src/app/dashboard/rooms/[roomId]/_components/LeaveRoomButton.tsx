"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconDoorExit } from "@tabler/icons-react";
import { useModalStore } from "@/stores/modal-store";
import { useRoomActions } from "@/hooks/use-room-actions";
import { LoadingButton } from "@/components/LoadingButton";

interface LeaveRoomButtonProps {
  roomId: string;
  roomName: string;
}

export function LeaveRoomButton({ roomId, roomName }: LeaveRoomButtonProps) {
  const { leaveRoomOpen, openLeaveRoom, closeLeaveRoom } = useModalStore();
  const { isLoading, handleLeaveRoom } = useRoomActions();

  const handleLeaveClick = () => {
    openLeaveRoom();
  };

  const handleLeaveConfirm = async () => {
    const success = await handleLeaveRoom(roomId);
    if (success) {
      closeLeaveRoom();
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleLeaveClick}>
        <IconDoorExit className="w-4 h-4" />
        Leave Room
      </Button>

      <AlertDialog open={leaveRoomOpen} onOpenChange={closeLeaveRoom}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave &quot;{roomName}&quot;? You can
              rejoin anytime using the room code.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <LoadingButton
              onClick={handleLeaveConfirm}
              isLoading={isLoading}
              loadingText="Leaving..."
              disabled={isLoading}
            >
              Leave Room
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
