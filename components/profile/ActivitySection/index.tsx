import { getSelfTimelineApi, getUserActivityByIdApi } from "@api/activity_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { Activity, User } from "@api/types";
import {
  Box,
  Divider,
  LoadingOverlay,
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

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const isMobile = useMobile();

  useEffect(() => {
    setIsLoading(true);
    if (isTimeline) {
      getSelfTimelineApi()
        .then((_activities) => {
          setActivities(_activities);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      getUserActivityByIdApi(user.id)
        .then((_activities) => {
          setActivities(_activities);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user.id, isTimeline]);

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
      </Box>
    </Box>
  );
};

export default ActivitySection;
