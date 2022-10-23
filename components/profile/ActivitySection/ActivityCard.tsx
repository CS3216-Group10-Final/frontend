import { Activity, ActivityType, GameEntryStatus } from "@api/types";
import { Anchor, Box, Card, Image, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import Link from "next/link";
import React from "react";
import { toProperCase } from "utils/helpers";

type Props = {
  activity: Activity;
};

const ActivityCard = (props: Props) => {
  const { activity } = props;
  const { user, new_status, new_rating, new_review, game, activity_type } =
    activity;

  const handleReviewModal = () => {
    openModal({
      title: `${user.username} review on ${game.name}`,
      children: <Text>{new_review}</Text>,
    });
  };

  const activityContent = {
    [ActivityType.CHANGED_STATUS]: (
      <Text>
        <b>{user.username}</b> updated{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>{" "}
        status to{" "}
        <b>{new_status && toProperCase(GameEntryStatus[new_status])}</b>
      </Text>
    ),
    [ActivityType.CREATED_REVIEW]: (
      <Text>
        <b>{user.username}</b> left a{" "}
        <Anchor component="span" onClick={handleReviewModal}>
          review
        </Anchor>{" "}
        for{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>
      </Text>
    ),
    [ActivityType.UPDATED_RATING]: (
      <Text>
        <b>{user.username}</b> has updated{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>{" "}
        rating to <b>{new_rating}</b>
      </Text>
    ),
  };

  return (
    <Card shadow="md" radius="lg" pl="xl" mt="sm">
      <Box
        sx={(theme) => ({
          display: "flex",
          gap: theme.spacing.md,
          alignItems: "center",
        })}
      >
        <Image
          width={48}
          height={48}
          src={activity.user.profile_picture_link}
          alt="profile picture"
          radius="md"
        />
        <Text
          sx={{
            flex: 1,
          }}
        >
          {activityContent[activity_type]}
        </Text>
      </Box>
    </Card>
  );
};

export default ActivityCard;
