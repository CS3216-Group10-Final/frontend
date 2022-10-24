import { GameEntryStatus } from "@api/types";

export function gameEntryStatusToString(status: GameEntryStatus): string {
  const mapping: Record<GameEntryStatus, string> = {
    [GameEntryStatus.WISHLIST]: "Wishlist",
    [GameEntryStatus.BACKLOG]: "Backlog",
    [GameEntryStatus.PLAYING]: "Playing",
    [GameEntryStatus.COMPLETED]: "Completed",
    [GameEntryStatus.DROPPED]: "Dropped",
  };
  return mapping[status];
}

export const LIST_OF_STATUSES = [
  GameEntryStatus.WISHLIST,
  GameEntryStatus.BACKLOG,
  GameEntryStatus.PLAYING,
  GameEntryStatus.COMPLETED,
  GameEntryStatus.DROPPED,
];

// Order in which sections appear on profile page
export const GAME_SECTION_ORDER = [
  GameEntryStatus.PLAYING,
  GameEntryStatus.COMPLETED,
  GameEntryStatus.BACKLOG,
  GameEntryStatus.DROPPED,
  GameEntryStatus.WISHLIST,
];

export const STATUS_DATA = LIST_OF_STATUSES.map((status) => {
  return {
    value: String(status),
    label: gameEntryStatusToString(status),
  };
});
