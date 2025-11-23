"use client";

import { PlaceholderGame } from "./PlaceholderGame";
import type { GameComponentProps } from "@/lib/games";

export function QuickQuizGame(props: GameComponentProps) {
  return (
    <PlaceholderGame
      {...props}
      gameName="Quick Quiz"
      gameDescription="Fast-paced general knowledge quiz"
    />
  );
}


