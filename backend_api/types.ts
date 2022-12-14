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
  ADDED_GAME = 3,
}

// In Progress
export type Genre = string;

// In Progress
export type Platform = string;

export interface User {
  id: number;
  username: string;
  bio?: string;
  profile_picture_link: string;
  is_following: boolean;
  badges: BadgeEntry[];
  steamid?: string;
  personaname?: string;
}

export interface UserStatistics {
  average_rating: number;
  total_games_played: number;
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
  first_release_date: string;
  summary: string;
  franchise: string;
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
  time_started?: string;
  time_completed?: string;
}

export interface Activity {
  id: number;
  user: User;
  time_created: string;
  new_status?: GameEntryStatus;
  new_rating?: number;
  new_review?: string;
  game: Game;
  activity_type: ActivityType;
}

export interface BadgeEntry {
  id: number;
  badge_name: string;
  badge_picture: string;
  badge_description: string;
  time_achieved: string;
}

export interface ReviewEntry {
  user_username: string;
  user_picture: string;
  game_id: number;
  rating: number;
  review: string;
  status: GameEntryStatus;
}

export enum PlatformCategory {
  OTHERS = 0,
  XBOX = 1,
  PLAYSTATION = 2,
  COMPUTER = 3,
  IOS = 4,
  ANDROID = 5,
  NINTENDO_SWITCH = 6,
  NINTENDO_HANDHELD = 7,
  NINTENDO_OTHER = 8,
  SEGA = 9,
}

export interface GameFilter {
  release_years: Set<number>;
  platforms: Set<PlatformCategory>;
  genres: Set<Genre>;
}
