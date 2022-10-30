import { getSelfTimelineApi, getUserActivityByIdApi } from "@api/activity_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { Activity, User } from "@api/types";
import {
  Box,
  Center,
  Divider,
  LoadingOverlay,
  Pagination,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useMobile } from "utils/useMobile";
import ActivityCard from "./ActivityCard";

type Props = {
  user: User;
  isTimeline: boolean;
};

const ActivitySection = (props: Props) => {
  const { user, isTimeline } = props;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);

  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    setIsLoading(true);
    if (isTimeline) {
      getSelfTimelineApi({ page: activePage })
        .then(({ activities, totalPage }) => {
          setActivities(activities);
          setTotalPage(totalPage ?? 0);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
          setActivities([]);
        })
        .finally(() => {
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
  }, [user.id, isTimeline, activePage]);

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
