/**
 * Game-related constants
 * Centralized constants for game functionality to improve maintainability
 */

// Game Session Statuses
export const GAME_SESSION_STATUS = {
  WAITING: "waiting",
  PLAYING: "playing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type GameSessionStatus =
  typeof GAME_SESSION_STATUS[keyof typeof GAME_SESSION_STATUS];

// Game Categories
export const GAME_CATEGORIES = {
  TRIVIA: "trivia",
  DRAWING: "drawing",
  WORD: "word",
  STRATEGY: "strategy",
  PARTY: "party",
  QUIZ: "quiz",
  GUESSING: "guessing",
  CREATIVE: "creative",
} as const;

export type GameCategory = typeof GAME_CATEGORIES[keyof typeof GAME_CATEGORIES];

// Game Event Types (for realtime communication)
export const GAME_EVENTS = {
  GAME_START: "game-start",
  GAME_END: "game-end",
  SCORE_UPDATE: "score-update",
  PLAYER_FINISHED: "player-finished",
  GAME_CANCELLED: "game-cancelled",
} as const;

export type GameEventType = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];

// Trivia Game Constants
export const TRIVIA_GAME = {
  QUESTIONS_PER_GAME: 5,
  TOTAL_GAME_TIME_SECONDS: 45,
  TIME_PER_QUESTION_SECONDS: 9, // Average time per question
  ANSWER_FEEDBACK_DELAY_MS: 2000, // Delay before showing next question
  WAITING_MESSAGE_ROTATION_INTERVAL_MS: 3000,
  WAITING_MESSAGES: [
    "Waiting for other players to finish...",
    "Hang tight! Others are still playing...",
    "Someone's taking their sweet time...",
    "Almost there! Waiting for the stragglers...",
    "This person is really thinking hard...",
    "Patience is a virtue... especially now...",
    "Waiting for the last player to finish...",
    "Someone's probably googling the answers...",
    "Still waiting... maybe they're stuck?",
    "Almost done! Just a few more seconds...",
  ],
} as const;

// Game Channel Prefix (for Supabase realtime)
export const GAME_CHANNEL_PREFIX = "game:";

// Game Validation Constants
export const GAME_VALIDATION = {
  MIN_PLAYERS_DEFAULT: 2,
  MAX_PLAYERS_DEFAULT: 8,
  MIN_ONLINE_PLAYERS_TO_START: 2,
} as const;

// Game UI Messages
export const GAME_MESSAGES = {
  WAITING_FOR_START: "Waiting for game to start...",
  WAITING_FOR_OWNER: "Waiting for room owner to start the game",
  WAITING_FOR_PLAYERS: "Waiting for more players to join",
  GAME_STARTED: "Game started!",
  GAME_COMPLETED: "Game completed!",
  GAME_CANCELLED: "Game cancelled",
  SESSION_CREATED: "Game session created! Click 'Start Game' to begin.",
  START_GAME: "Start Game",
  END_GAME: "End Game",
  CANCEL_GAME: "Cancel Game",
  CLEAR_GAME: "Clear Game & Choose New Game",
  CHOOSE_GAME: "Choose a Game",
  NO_GAME_SELECTED: "No game selected",
  GAME_IN_PROGRESS: "A game is already in progress",
  NOT_ENOUGH_PLAYERS: "Not enough players",
  TOO_MANY_PLAYERS: "Too many players",
  ONLY_OWNER_CAN_START: "Only room owner can start games",
  ONLY_OWNER_CAN_END: "Only room owner can end games",
  ONLY_OWNER_CAN_CANCEL: "Only room owner can cancel games",
} as const;

// Game Error Messages
export const GAME_ERRORS = {
  NOT_AUTHENTICATED: "Not authenticated",
  ROOM_NOT_FOUND: "Room not found",
  GAME_NOT_FOUND: "Game not found",
  GAME_INACTIVE: "Game is inactive",
  SESSION_NOT_FOUND: "Game session not found",
  INVALID_STATUS: "Game is not in the correct status",
  SESSION_MISMATCH: "Game session does not belong to this room",
  ALREADY_SUBMITTED: "You have already submitted an answer",
  FAILED_TO_CREATE: "Failed to create game session",
  FAILED_TO_START: "Failed to start game",
  FAILED_TO_END: "Failed to end game",
  FAILED_TO_CANCEL: "Failed to cancel game",
  FAILED_TO_SUBMIT: "Failed to submit answer",
  ONLY_OWNER_CAN_START: "Only room owner can start games",
  GAME_IN_PROGRESS: "A game is already in progress",
} as const;

// Game Result Constants
export const GAME_RESULTS = {
  WINNER_POSITION: 1,
  MIN_SCORE_TO_WIN: 1,
} as const;


