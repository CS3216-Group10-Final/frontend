import { User, UserStatistics } from "@api/types";
import { Box, Group, Text } from "@mantine/core";
import ChartBarDistribution from "./ChartBarDistribution";

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

  return (
    <Box>
      {userStatistics && (
        <Text align="center">
          Average rating: {userStatistics.average_rating.toFixed(1)}/10
        </Text>
      )}
      {userStatistics && (
        <Group mt={36} align="center" grow>
          <ChartBarDistribution
            gameStatusDistribution={userStatistics.game_status_distribution}
            gameGenreDistribution={userStatistics.game_genre_distribution}
            platformDistribution={userStatistics.platform_distribution}
            releaseYearDistribution={userStatistics.release_year_distribution}
            playYearDistribution={userStatistics.play_year_distribution}
          />
        </Group>
      )}
    </Box>
  );
};

export default StatisticsSection;
