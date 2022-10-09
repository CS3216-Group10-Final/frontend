import { useAppSelector } from "@redux/hooks";
import { selectUserStatistics } from "@redux/slices/UserStatistics_slice";
import { Avatar, Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import ChartBarDistribution from "@components/profile/ChartBarDistribution";
import GameSection from "@components/profile/GameSection";
// import { GameEntryStatus, Genre, Platform } from "@api/types";

// const game_status_distribution: Record<GameEntryStatus, number> = {
//   [GameEntryStatus.WISHLIST]: 10,
//   [GameEntryStatus.BACKLOG]: 15,
//   [GameEntryStatus.PLAYING]: 12,
//   [GameEntryStatus.COMPLETED]: 100,
//   [GameEntryStatus.DROPPED]: 50,
// };

// const game_genre_distribution: Partial<Record<Genre, number>> = {
//   FPS: 12,
//   MMORPG: 11,
//   MOBA: 3,
//   OTHERS: 40,
// };

// const platform_distribution: Partial<Record<Platform, number>> = {
//   PC: 100,
//   Playstation: 5,
// };

// const play_year_distribution: Record<number, number> = {
//   2001: 10,
//   2002: 15,
//   2003: 12,
//   2004: 11,
//   2005: 21,
// };

// const release_year_distribution: Record<number, number> = {
//   2001: 5,
//   2002: 21,
//   2003: 13,
//   2004: 43,
//   2005: 11,
//   2006: 12,
//   2007: 11,
//   2008: 14,
// };

const ProfilePage = () => {
  // TODO: Fetch user statistics

  const {
    average_rating,
    game_status_distribution,
    game_genre_distribution,
    platform_distribution,
    play_year_distribution,
    release_year_distribution,
  } = useAppSelector(selectUserStatistics);

  return (
    <Stack>
      <Box>
        <Avatar size={128} radius={18} mx="auto" mb={24} />
        <Text size="xl" align="center" mb={8} color="white">
          Username
        </Text>
      </Box>
      <Divider />
      <Box>
        <Title order={1} align="center">
          Statistics
        </Title>
        <Text align="center">Average rating: {average_rating}/10</Text>
        <Group mt={36} align="center" grow>
          <ChartBarDistribution
            gameStatusDistribution={game_status_distribution}
            gameGenreDistribution={game_genre_distribution}
            platformDistribution={platform_distribution}
            releaseYearDistribution={play_year_distribution}
            playYearDistribution={release_year_distribution}
          />
        </Group>
      </Box>
      <Divider />
      <Box>
        <GameSection />
      </Box>
    </Stack>
  );
};

export default ProfilePage;
