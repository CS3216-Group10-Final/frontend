import { Activity, ActivityType, GameEntryStatus } from "@api/types";
import ReviewModal from "@components/ReviewModal";
import { Anchor, Box, Card, Image, Text, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineInfoCircle, AiOutlineStar } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { TbFileText } from "react-icons/tb";
import { toProperCase } from "utils/helpers";

type Props = {
  activity: Activity;
  isTimeline: boolean;
};

const ActivityCard = (props: Props) => {
  const { activity, isTimeline } = props;
  const { user, new_status, new_rating, new_review, game, activity_type } =
    activity;
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState<boolean>(false);

  const Username = () => {
    return (
      <>
        {isTimeline && (
          <Link href={`/user/${user.username}`} passHref>
            <Anchor component="a" style={{ color: "white" }}>
              <b>{user.username}</b>
            </Anchor>
          </Link>
        )}
        {!isTimeline && <b>{user.username}</b>}
      </>
    );
  };

  const activityContent = {
    [ActivityType.CHANGED_STATUS]: (
      <Text>
        <Username /> updated{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>{" "}
        status to{" "}
        <b>{new_status && toProperCase(GameEntryStatus[new_status])}</b>
      </Text>
    ),
    [ActivityType.CREATED_REVIEW]: (
      <>
        <Text>
          <Username /> left a{" "}
          <Anchor
            component="span"
            onClick={() => {
              setReviewModalIsOpen(true);
            }}
          >
            review
          </Anchor>{" "}
          for{" "}
          <Link href={`/games/${game.id}`} passHref>
            <Anchor component="a">{game.name}</Anchor>
          </Link>
        </Text>
        <ReviewModal
          isOpen={reviewModalIsOpen}
          onClose={() => setReviewModalIsOpen(false)}
          game_name={game.name}
          review={new_review ?? ""}
          username={user.username}
        />
      </>
    ),
    [ActivityType.UPDATED_RATING]: (
      <Text>
        <Username /> has updated the rating of{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>{" "}
        to <b>{new_rating}</b>
      </Text>
    ),
    [ActivityType.ADDED_GAME]: (
      <Text>
        <Username /> has added{" "}
        <Link href={`/games/${game.id}`} passHref>
          <Anchor component="a">{game.name}</Anchor>
        </Link>{" "}
        to their display case
      </Text>
    ),
  };

  const activityIcons: Record<ActivityType, JSX.Element> = {
    [ActivityType.CHANGED_STATUS]: <AiOutlineInfoCircle />,
    [ActivityType.CREATED_REVIEW]: <TbFileText />,
    [ActivityType.UPDATED_RATING]: <AiOutlineStar />,
    [ActivityType.ADDED_GAME]: <BsPlus size={28} />,
  };

  const activityIconColors: Record<ActivityType, string> = {
    [ActivityType.CHANGED_STATUS]: "blue",
    [ActivityType.CREATED_REVIEW]: "green",
    [ActivityType.UPDATED_RATING]: "yellow",
    [ActivityType.ADDED_GAME]: "orange",
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
        <ThemeIcon color={activityIconColors[activity_type]}>
          {activityIcons[activity_type]}
        </ThemeIcon>
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
        <Link href={`/games/${game.id}`}>
          <Image
            width={48}
            height={48}
            src={activity.game.cover}
            alt="profile picture"
            radius="md"
            sx={{ cursor: "pointer" }}
          />
        </Link>
      </Box>
    </Card>
  );
};

export default ActivityCard;
