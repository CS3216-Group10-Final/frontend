export enum GameEntryStatus {
  WISHLIST = 0,
  BACKLOG = 1,
  PLAYING = 2,
  COMPLETED = 3,
  DROPPED = 4,
}

export enum ActivityType {
  CHANGED_STATUS = 0,
  UPDATED_RATING = 1,
  CREATED_REVIEW = 2,
}

// In Progress
export type Genre = string;

// In Progress
export type Platform = string;

export interface User {
  id: number;
  username: string;
  profile_picture_link: string;
  is_following: boolean;
  badges: BadgeEntry[];
}

export interface UserStatistics {
  average_rating: number;
  game_status_distribution: Partial<Record<GameEntryStatus, number>>;
  game_genre_distribution: Partial<Record<Genre, number>>;
  platform_distribution: Partial<Record<Platform, number>>;
  release_year_distribution: Record<number, number>;
  play_year_distribution: Record<number, number>;
}

// In progress
export interface Game {
  id: number;
  name: string;
  cover: string;
  first_release_date: Date;
  summary: string;
  franchis: string;
  genres: Genre[];
  platforms: Platform[];
}

export interface GameEntry {
  id: number;
  user_id: number;
  game_id: number;
  game_name: string;
  game_cover: string;
  rating?: number;
  review?: string;
  hours?: number;
  is_favourite: boolean;
  platforms?: Platform[];
  status: GameEntryStatus;
  time_started?: Date;
  time_completed?: Date;
}

export interface BadgeEntry {
  id: number;
  badge_name: string;
  badge_picture: string;
  badge_description: string;
  time_achieved: Date;
}
