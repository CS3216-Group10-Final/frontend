import { GameEntryStatus, User, UserStatistics } from "@api/types";
import { Box, Card, Grid, Group, Text } from "@mantine/core";
import ChartBarDistribution from "./ChartBarDistribution";
import { TbStars, TbDeviceGamepad2 } from "react-icons/tb";

type Props = {
  user: User;
  userStatistics: UserStatistics | null;
};

const StatisticsSection = (props: Props) => {
  const { userStatistics } = props;

  // useEffect(() => {
  //   getUserStatisticsByNameApi(user.username)
  //     .then((apiUserStatistics) => {
  //       setUserStatistics(apiUserStatistics);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [user]);

  if (!userStatistics) {
    return null;
  }

  return (
    <Box>
      <Grid>
        <Grid.Col xs={12} sm={6}>
          <Card
            radius="lg"
            shadow="sm"
            p="xl"
            color="yellow"
            sx={(theme) => ({
              backgroundImage: theme.fn.linearGradient(
                45,
                theme.colors.yellow[5],
                theme.colors.orange[5]
              ),
              color: theme.white,
            })}
          >
            <Group position="apart">
              <Group>
                <TbStars size={64} />
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
          <Card
            radius="lg"
            shadow="sm"
            p="xl"
            color="yellow"
            sx={(theme) => ({
              backgroundImage: theme.fn.linearGradient(
                45,
                theme.colors.yellow[5],
                theme.colors.orange[5]
              ),
              color: theme.white,
            })}
          >
            <Group position="apart">
              <Group>
                <TbDeviceGamepad2 size={64} />
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
                {/* TODO: change to total game count */}
                {121}
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
