/* eslint-disable jsx-a11y/alt-text */
import { GameEntry, GameEntryStatus } from "@api/types";
import ReviewModal from "@components/ReviewModal";
import {
  ActionIcon,
  Card,
  Grid,
  Group,
  HoverCard,
  Image,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";
import { TbEdit, TbFileText } from "react-icons/tb";
import {
  allPlatformCategories,
  categorizePlatforms,
  getPlatformCategoryIcon,
} from "utils/platform_categories";
import { useMobile } from "utils/useMobile";

type Props = {
  gameEntry: GameEntry;
  username: string;
  onClickEdit?: (gameEntry: GameEntry) => void;
  isEditable: boolean;
};

const GameEntryCard = (props: Props) => {
  const { gameEntry, onClickEdit, isEditable, username } = props;
  const {
    game_id,
    game_name: title,
    game_cover: cover,
    rating,
    review,
    platforms,
    status,
  } = gameEntry;
  const isMobile = useMobile();
  const { ref, hovered } = useHover();
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState<boolean>(false);
  const theme = useMantineTheme();
  const categorizedPlatforms = categorizePlatforms(platforms ?? []);

  const badgeColor = {
    [GameEntryStatus.DROPPED]: theme.colors.red[5],
    [GameEntryStatus.COMPLETED]: theme.colors.green[5],
    [GameEntryStatus.PLAYING]: theme.colors.yellow[5],
    [GameEntryStatus.BACKLOG]: theme.colors.blue[5],
    [GameEntryStatus.WISHLIST]: theme.colors.dark[3],
  };

  return (
    <div>
      <Card
        p={0}
        style={{ borderLeft: "10px solid", borderColor: badgeColor[status] }}
      >
        <Grid align="center">
          <Grid.Col span={3} p={0}>
            <Image
              width="100%"
              height="auto"
              fit="fill"
              withPlaceholder
              src={cover}
              sx={{ maxHeight: 120 }}
            />
          </Grid.Col>
          <Grid.Col span={isMobile ? 5 : 7} p={0} pl="sm">
            <Stack>
              <Link href={`/games/${game_id}`}>
                <Text
                  mt="sm"
                  size="md"
                  weight={500}
                  sx={{ cursor: "pointer" }}
                  ref={ref}
                  underline={hovered}
                >
                  {title}
                </Text>
              </Link>
              <Group>
                <Group>
                  {allPlatformCategories.map((platformCategory) => {
                    if (categorizedPlatforms[platformCategory].length === 0) {
                      return <></>;
                    } else {
                      return (
                        <>
                          <HoverCard shadow="md">
                            <HoverCard.Target>
                              <ActionIcon>
                                {getPlatformCategoryIcon(platformCategory)}
                              </ActionIcon>
                            </HoverCard.Target>
                            <HoverCard.Dropdown p={6}>
                              <Text size="xs" align="center">
                                {categorizedPlatforms[platformCategory].join(
                                  ", "
                                )}
                              </Text>
                            </HoverCard.Dropdown>
                          </HoverCard>
                        </>
                      );
                    }
                  })}
                </Group>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={isMobile ? 4 : 2} p={0}>
            <Group sx={{ height: "100%" }} position="right" mr="sm">
              {review && (
                <Tooltip label="Read review">
                  <ActionIcon
                    onClick={() => {
                      setReviewModalIsOpen(true);
                    }}
                  >
                    <TbFileText size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              {rating !== undefined && rating !== null && (
                <Text
                  size="md"
                  align="right"
                  mr={isEditable ? 0 : "sm"}
                  weight={500}
                >
                  {rating}/10
                </Text>
              )}
              {isEditable && (
                <Tooltip label="Edit game entry">
                  <ActionIcon
                    mr="sm"
                    onClick={() => {
                      onClickEdit && onClickEdit(gameEntry);
                    }}
                  >
                    <TbEdit size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Grid.Col>
        </Grid>
        <ReviewModal
          isOpen={reviewModalIsOpen}
          onClose={() => setReviewModalIsOpen(false)}
          game_name={title}
          rating={rating}
          review={review ?? ""}
          username={username}
        />
      </Card>
    </div>
  );
};

export default GameEntryCard;
