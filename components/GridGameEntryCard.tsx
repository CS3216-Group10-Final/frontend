import { GameEntry } from "@api/types";
import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  HoverCard,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TbEdit, TbFileText } from "react-icons/tb";
import {
  allPlatformCategories,
  categorizePlatforms,
  getPlatformCategoryIcon,
} from "utils/platform_categories";
import { useStatusColor } from "utils/status";
import ReviewModal from "./ReviewModal";

const useStyles = createStyles((theme, _params, getRef) => {
  const coloredOverlay = getRef("coloredOverlay");
  return {
    card: {
      position: "relative",
      height: 200,
      cursor: "pointer",
      [`&:hover .${coloredOverlay}`]: {
        width: "100%",
        visibility: "visible",
      },
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      transition: "transform 500ms ease",
    },

    overlay: {
      position: "absolute",
      top: "20%",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
    },

    coloredOverlay: {
      ref: coloredOverlay,
      position: "absolute",
      left: 0,
      top: 0,
      width: 0,
      height: "100%",
      transition: "80ms",
      visibility: "hidden",
      zIndex: 5,
    },

    content: {
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      zIndex: 1,
    },
  };
});

interface Props {
  gameEntry: GameEntry;
  username: string;
  onClickEdit: (gameEntry: GameEntry) => void;
  isEditable: boolean;
}

const GridGameEntryCard = ({
  gameEntry,
  username,
  onClickEdit,
  isEditable,
}: Props) => {
  const { classes } = useStyles();
  const {
    game_id,
    game_name: title,
    game_cover: cover,
    rating,
    review,
    platforms,
    status,
  } = gameEntry;
  const categorizedPlatforms = categorizePlatforms(platforms ?? []);
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState<boolean>(false);

  const badgeColor = useStatusColor();

  return (
    <div className={classes.card}>
      <Card
        p="lg"
        shadow="lg"
        radius="md"
        style={{
          width: "100%",
          height: "100%",
          borderLeft: "5px solid",
          borderColor: badgeColor[status],
        }}
      >
        <div
          className={classes.image}
          style={{ backgroundImage: `url(${cover})` }}
        />
        <div className={classes.overlay} />

        {rating !== null && rating !== undefined && (
          <div style={{ position: "absolute", top: 8, right: 8, zIndex: 7 }}>
            <Paper p={3}>
              <Text color={"white"}>{rating}/10</Text>
            </Paper>
          </div>
        )}
        <div className={classes.content}>
          <Text size="sm">{title}</Text>
        </div>
        <div
          className={classes.coloredOverlay}
          style={{ background: badgeColor[status] }}
        >
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 3,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Stack>
              {review && (
                <ActionIcon
                  variant="light"
                  onClick={() => {
                    setReviewModalIsOpen(true);
                  }}
                >
                  <TbFileText size={24} />
                </ActionIcon>
              )}
              <Link href={`/games/${game_id}`}>
                <ActionIcon variant="light">
                  <AiOutlineInfoCircle size={24} />
                </ActionIcon>
              </Link>
            </Stack>
            {isEditable && (
              <ActionIcon
                variant="light"
                onClick={() => {
                  onClickEdit(gameEntry);
                }}
                ml={12}
              >
                <TbEdit size={24} />
              </ActionIcon>
            )}
          </div>

          <div style={{ position: "absolute", bottom: 8, left: 3 }}>
            <Group>
              {allPlatformCategories.map((platformCategory) => {
                if (categorizedPlatforms[platformCategory].length === 0) {
                  return <></>;
                } else {
                  return (
                    <>
                      <HoverCard shadow="md" width={100} position="top">
                        <HoverCard.Target>
                          <ActionIcon variant="filled">
                            {getPlatformCategoryIcon(platformCategory)}
                          </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown p={6}>
                          <Text size="xs" align="center">
                            {categorizedPlatforms[platformCategory].join(", ")}
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </>
                  );
                }
              })}
            </Group>
          </div>
        </div>
      </Card>
      <ReviewModal
        isOpen={reviewModalIsOpen}
        onClose={() => setReviewModalIsOpen(false)}
        game_name={title}
        rating={rating}
        review={review ?? ""}
        username={username}
      />
    </div>
  );
};

export default GridGameEntryCard;
