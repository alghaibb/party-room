"use client";

import { PlaceholderGame } from "./PlaceholderGame";
import type { GameComponentProps } from "@/lib/games";

export function TwentyQuestionsGame(props: GameComponentProps) {
  return (
    <PlaceholderGame
      {...props}
      gameName="20 Questions"
      gameDescription="Guess the mystery object in 20 questions"
    />
  );
}




