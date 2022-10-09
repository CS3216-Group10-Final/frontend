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
export enum Genre {
  OTHERS = 0,
  FPS = 1,
  MMORPG = 2,
  MOBA = 3,
}

// In Progress
export enum Platform {
  PC = 0,
}

export interface User {
  id: number;
  username: string;
  profile_picture_link: string;
  is_following: boolean;
}

export interface UserStatistics {
  average_rating: number;
  game_status_distribution: Record<GameEntryStatus, number>;
  game_genre_distribution?: Record<Genre, number>;
  platform_distribution?: Record<Platform, number>;
  release_year_distribution?: Record<number, number>;
  play_year_distribution?: Record<number, number>;
}

// In progress
export interface Game {
  id: number;
  name: string;
  cover: string;
  first_release_date: Date;
  genres: string[];
  platforms: string[];
}

export interface GameEntry {
  id: number;
  user_id: number;
  game_id: number;
  rating?: number;
  review?: string;
  hours?: number;
  is_favourite: boolean;
  status: GameEntryStatus;
  time_started: Date;
  time_completed: Date;
}
