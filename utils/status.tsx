import { GameEntryStatus } from "@api/types";
import { useMantineTheme } from "@mantine/core";

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

export const STATUS_MANTINE_COLOR: Record<GameEntryStatus, string> = {
  [GameEntryStatus.WISHLIST]: "dark.3",
  [GameEntryStatus.BACKLOG]: "blue.5",
  [GameEntryStatus.PLAYING]: "yellow.5",
  [GameEntryStatus.COMPLETED]: "green.5",
  [GameEntryStatus.DROPPED]: "red.5",
};

export function useStatusColor() {
  const theme = useMantineTheme();
  return {
    [GameEntryStatus.DROPPED]: theme.colors.red[5],
    [GameEntryStatus.COMPLETED]: theme.colors.green[5],
    [GameEntryStatus.PLAYING]: theme.colors.yellow[5],
    [GameEntryStatus.BACKLOG]: theme.colors.blue[5],
    [GameEntryStatus.WISHLIST]: theme.colors.dark[3],
  };
}

export const statusOrderComparator = (
  a: GameEntryStatus,
  b: GameEntryStatus
) => {
  return GAME_SECTION_ORDER.indexOf(a) - GAME_SECTION_ORDER.indexOf(b);
};

export const STATUS_DATA = LIST_OF_STATUSES.map((status) => {
  return {
    value: String(status),
    label: gameEntryStatusToString(status),
  };
});
