import { User, UserStatistics } from "@api/types";
import { Box, Card, Grid, Group, Text, ThemeIcon } from "@mantine/core";
import { TbDeviceGamepad2, TbStars } from "react-icons/tb";
import ChartBarDistribution from "./charts/ChartBarDistribution";

type Props = {
  user: User;
  userStatistics: UserStatistics | null;
};

const StatisticsSection = (props: Props) => {
  const { userStatistics } = props;

  if (!userStatistics) {
    return null;
  }

  return (
    <Box>
      <Grid>
        <Grid.Col xs={12} sm={6}>
          <Card radius="lg" shadow="sm" p="xl">
            <Group position="apart">
              <Group>
                <ThemeIcon
                  size={80}
                  radius="lg"
                  variant="gradient"
                  gradient={{
                    from: "yellow",
                    to: "orange",
                    deg: 45,
                  }}
                >
                  <TbStars size={64} />
                </ThemeIcon>
                <Text
                  align="center"
                  size={24}
                  weight={700}
                  sx={{ lineHeight: "1.3em" }}
                >
                  Average
                  <br /> Rating
                </Text>
              </Group>
              <Text align="center" size={64} weight={700}>
                {userStatistics.average_rating.toFixed(1)}
              </Text>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <Card radius="lg" shadow="sm" p="xl">
            <Group position="apart">
              <Group>
                <ThemeIcon
                  size={80}
                  radius="lg"
                  variant="gradient"
                  gradient={{
                    from: "yellow",
                    to: "orange",
                    deg: 45,
                  }}
                >
                  <TbDeviceGamepad2 size={64} />
                </ThemeIcon>
                <Text
                  align="center"
                  size={24}
                  weight={700}
                  sx={{ lineHeight: "1.3em" }}
                >
                  Games
                  <br /> Played
                </Text>
              </Group>
              <Text align="center" size={64} weight={700}>
                {userStatistics.total_games_played}
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
      <Group mt={36} align="center" grow>
        <ChartBarDistribution
          gameStatusDistribution={userStatistics.game_status_distribution}
          gameGenreDistribution={userStatistics.game_genre_distribution}
          platformDistribution={userStatistics.platform_distribution}
          releaseYearDistribution={userStatistics.release_year_distribution}
          playYearDistribution={userStatistics.play_year_distribution}
        />
      </Group>
    </Box>
  );
};

export default StatisticsSection;
