"use client";

import { PlaceholderGame } from "./PlaceholderGame";
import type { GameComponentProps } from "@/lib/games";

export function DrawingGuessingGame(props: GameComponentProps) {
  return (
    <PlaceholderGame
      {...props}
      gameName="Drawing Guessing Game"
      gameDescription="Draw and guess what others are drawing"
    />
  );
}


