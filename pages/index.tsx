import { GameEntryStatus } from "@api/types";
import PageHeader from "@components/PageHeader";
import ChartBarDistribution from "@components/profile/ChartBarDistribution";
import { Avatar, Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import type { NextPage } from "next";

const gameStatusDistribution: Record<GameEntryStatus, number> = {
  [GameEntryStatus.WISHLIST]: 10,
  [GameEntryStatus.BACKLOG]: 15,
  [GameEntryStatus.PLAYING]: 12,
  [GameEntryStatus.COMPLETED]: 100,
  [GameEntryStatus.DROPPED]: 50,
};

const Home: NextPage = () => {
  return (
    <>
      <PageHeader title="DisplayCase" description="Display" />
      <Stack>
        <Box>
          <Avatar size={128} radius={18} mx="auto" mb={24} />
          <Text size="xl" align="center" mb={8} color="white">
            Dakimakura
          </Text>
        </Box>
        <Divider />
        <Box>
          <Title order={1} align="center">
            Statistics
          </Title>
          <Group mt={36} align="center" grow>
            <ChartBarDistribution
              gameStatusDistribution={gameStatusDistribution}
            />
          </Group>
        </Box>
      </Stack>
      <Divider />
    </>
  );
};

export default Home;
