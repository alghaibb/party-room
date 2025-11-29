"use client";

import { PlaceholderGame } from "./PlaceholderGame";
import type { GameComponentProps } from "@/lib/games";

export function StoryBuilderGame(props: GameComponentProps) {
  return (
    <PlaceholderGame
      {...props}
      gameName="Story Builder"
      gameDescription="Collaborative storytelling game"
    />
  );
}




