import { create } from 'zustand';

interface ModalStore {
  // Join Room Modal
  joinRoomOpen: boolean;
  openJoinRoom: () => void;
  closeJoinRoom: () => void;

  // Delete Room Modal
  deleteRoomOpen: boolean;
  openDeleteRoom: () => void;
  closeDeleteRoom: () => void;

  // Leave Room Modal
  leaveRoomOpen: boolean;
  openLeaveRoom: () => void;
  closeLeaveRoom: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Join Room Modal State
  joinRoomOpen: false,
  openJoinRoom: () => set({ joinRoomOpen: true }),
  closeJoinRoom: () => set({ joinRoomOpen: false }),

  // Delete Room Modal State
  deleteRoomOpen: false,
  openDeleteRoom: () => set({ deleteRoomOpen: true }),
  closeDeleteRoom: () => set({ deleteRoomOpen: false }),

  // Leave Room Modal State  
  leaveRoomOpen: false,
  openLeaveRoom: () => set({ leaveRoomOpen: true }),
  closeLeaveRoom: () => set({ leaveRoomOpen: false }),
}));
