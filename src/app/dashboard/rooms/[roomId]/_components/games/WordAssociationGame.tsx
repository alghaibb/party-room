"use client";

import { PlaceholderGame } from "./PlaceholderGame";
import type { GameComponentProps } from "@/lib/games";

export function WordAssociationGame(props: GameComponentProps) {
  return (
    <PlaceholderGame
      {...props}
      gameName="Word Association"
      gameDescription="Quick-fire word association game"
    />
  );
}


