import { Stack, Card, Box, Title } from "@mantine/core";
import { GameEntryStatus, Genre, Platform } from "@api/types";
import { useMobile } from "utils/useMobile";
import GameStatusChart from "./charts/GameStatusChart";
import GenreChart from "./charts/GenreChart";
import PlatformChart from "./charts/PlatformChart";
import ReleaseYearChart from "./charts/ReleaseYearChart";

type Props = {
  gameStatusDistribution: Partial<Record<GameEntryStatus, number>>;
  gameGenreDistribution: Partial<Record<Genre, number>>;
  platformDistribution: Partial<Record<Platform, number>>;
  releaseYearDistribution: Record<number, number>;
  playYearDistribution: Record<number, number>;
};

enum ChartType {
  STATUS = "Status",
  GENRE = "Genre",
  PLATFORM = "Platform",
  RELEASE = "Release Year",
  PLAY_YEAR = "Play Year",
}

const ChartBarDistribution = (props: Props) => {
  const {
    gameStatusDistribution,
    gameGenreDistribution,
    platformDistribution,
    releaseYearDistribution,
    playYearDistribution,
  } = props;

  const isMobile = useMobile();

  const chart = {
    [ChartType.STATUS]: (
      <GameStatusChart gameStatusDistribution={gameStatusDistribution} />
    ),
    [ChartType.GENRE]: (
      <GenreChart gameGenreDistribution={gameGenreDistribution} />
    ),
    [ChartType.PLATFORM]: (
      <PlatformChart platformDistribution={platformDistribution} />
    ),
    [ChartType.RELEASE]: (
      <ReleaseYearChart releaseYearDistribution={releaseYearDistribution} />
    ),
  };

  return (
    <>
      {Object.keys(chart).map((key) => {
        const chartType = key as keyof typeof chart;

        return (
          <Box sx={{ width: "100%" }} key={key}>
            <Card radius="lg" shadow="sm" p="xl">
              <Title align="center">{key}</Title>
              <Stack align="center" sx={{ width: "100%" }} mt="lg">
                <Box
                  component="div"
                  sx={{
                    minHeight: 256,
                    width: isMobile ? "100%" : "80%",
                    overflow: "visible",
                  }}
                >
                  {chart[chartType]}
                </Box>
              </Stack>
            </Card>
          </Box>
        );
      })}
    </>
  );
};

export default ChartBarDistribution;
