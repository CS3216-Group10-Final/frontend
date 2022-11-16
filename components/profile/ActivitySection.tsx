import {
  getSelfTimelineApi,
  getSelfTimelineRecentGamesApi,
  getUserActivityByIdApi,
} from "@api/activity_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { Activity, Game, User } from "@api/types";
import GameCard from "@components/GameCard";
import {
  Box,
  Card,
  Center,
  Divider,
  LoadingOverlay,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useAppDispatch } from "@redux/hooks";
import { getGameEntries } from "@redux/slices/GameEntry_slice";
import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useMobile } from "utils/useMobile";
import ActivityCard from "../ActivityCard";

type Props = {
  user: User;
  isTimeline: boolean;
};

const NUM_OF_RECENT_GAMES = 5;

const ActivitySection = (props: Props) => {
  const { user, isTimeline } = props;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);

  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [selectedRecentGameId, setSelectedRecentGameId] = useState<number>();

  const [isLoading, setIsLoading] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMobile();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    if (isTimeline) {
      const timelinePromise = getSelfTimelineApi({
        page: activePage,
        game_id: selectedRecentGameId,
      })
        .then(({ activities, totalPage }) => {
          setActivities(activities);
          setTotalPage(totalPage ?? 0);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
          setActivities([]);
        });

      const recentGamesPromise = getSelfTimelineRecentGamesApi(
        NUM_OF_RECENT_GAMES
      )
        .then((games) => {
          setRecentGames(games);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
          setRecentGames([]);
        });

      Promise.all([timelinePromise, recentGamesPromise]).finally(() => {
        setIsLoading(false);
      });
    } else {
      getUserActivityByIdApi(user.id, activePage)
        .then(({ activities, totalPage }) => {
          setActivities(activities);
          setTotalPage(totalPage ?? 0);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user.id, isTimeline, activePage, selectedRecentGameId]);

  useEffect(() => {
    dispatch(getGameEntries({ user_id: user.id }))
      .unwrap()
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  });

  const loadPage = (page: number) => {
    setActivePage(page);
  };

  const activitiesByDate = activities.reduce(
    (acc: Record<string, Activity[]>, activity) => {
      const dateString = format(parseISO(activity.time_created), "dd MMM yyyy");

      (acc[dateString] = acc[dateString] || []).push(activity);

      return acc;
    },
    {}
  );

  const activityDates = Object.keys(activitiesByDate).sort((x, y) =>
    differenceInDays(new Date(y), new Date(x))
  );

  return (
    <Box>
      {isLoading && <LoadingOverlay visible={isLoading} mt="md" />}
      {isTimeline && (
        <SimpleGrid
          cols={6}
          spacing="lg"
          breakpoints={[
            { maxWidth: theme.breakpoints.md, cols: 3, spacing: "sm" },
            { maxWidth: theme.breakpoints.sm, cols: 2, spacing: "sm" },
          ]}
        >
          <Box
            sx={(theme) => ({
              padding: 2,
              borderRadius: theme.radius.md,
              backgroundColor: !selectedRecentGameId
                ? theme.colors.yellow[5]
                : "",
            })}
          >
            <Card
              style={{
                height: isMobile ? 100 : 180,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
              p="lg"
              shadow="lg"
              radius="md"
              onClick={() => {
                setSelectedRecentGameId(undefined);
              }}
            >
              <Text size="md">All Activities</Text>
            </Card>
          </Box>
          {recentGames.map((game) => {
            return (
              <Box
                key={game.id}
                sx={(theme) => ({
                  padding: 2,
                  borderRadius: theme.radius.md,
                  backgroundColor:
                    selectedRecentGameId === game.id
                      ? theme.colors.yellow[5]
                      : "",
                })}
              >
                <GameCard
                  game={game}
                  height={isMobile ? 100 : 180}
                  hideTitle={isMobile ? true : false}
                  titleSize="md"
                  overrideOnClick={() => {
                    setSelectedRecentGameId(game.id);
                  }}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      )}
      <Box sx={{ position: "relative", height: isLoading ? 300 : "auto" }}>
        {activityDates.map((date) => {
          return (
            <Box key={date} mt="md">
              <Divider size="sm" my="xs" label={date} labelPosition="center" />
              {activitiesByDate[date].map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isTimeline={isTimeline}
                />
              ))}
            </Box>
          );
        })}
        {!isLoading && activities.length === 0 && (
          <Stack align="center">
            <Title size={isMobile ? 24 : 32}>
              {isTimeline ? "No activities" : "This user has no activities"}
            </Title>
            {isTimeline && (
              <Text size={isMobile ? 14 : 18}>Try following some people!</Text>
            )}
          </Stack>
        )}
        {totalPage > 0 && (
          <Center mt={20}>
            <Pagination
              total={totalPage}
              page={activePage}
              onChange={loadPage}
            />
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default ActivitySection;
