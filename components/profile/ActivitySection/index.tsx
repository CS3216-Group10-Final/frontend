import { getUserActivityByIdApi } from "@api/activity_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { Activity, User } from "@api/types";
import { Box, Divider, LoadingOverlay } from "@mantine/core";
import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";

type Props = {
  user: User;
};

const ActivitySection = (props: Props) => {
  const { user } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setIsLoading(true);
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
  }, [user.id]);

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
      <Box sx={{ position: "relative", height: isLoading ? 300 : "auto" }}>
        {isLoading && <LoadingOverlay visible={isLoading} mt="md" />}
        {isLoading ||
          activityDates.map((date) => {
            return (
              <Box key={date} mt="md">
                <Divider
                  size="sm"
                  my="xs"
                  label={date}
                  labelPosition="center"
                />
                {activitiesByDate[date].map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default ActivitySection;
