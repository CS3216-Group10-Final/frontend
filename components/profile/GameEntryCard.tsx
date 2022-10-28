/* eslint-disable jsx-a11y/alt-text */
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { GameEntry } from "@api/types";
import ReviewModal from "@components/ReviewModal";
import {
  ActionIcon,
  Card,
  Group,
  HoverCard,
  Image,
  Select,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useAppDispatch } from "@redux/hooks";
import {
  changeGameEntryStatus,
  updateGameEntryFavorite,
} from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbEdit, TbFileText } from "react-icons/tb";
import { showSuccessNotification } from "utils/notifications";
import {
  allPlatformCategories,
  categorizePlatforms,
  getPlatformCategoryIcon,
} from "utils/platform_categories";
import { STATUS_DATA, useStatusColor } from "utils/status";
import { useMobile } from "utils/useMobile";

type Props = {
  gameEntry: GameEntry;
  username: string;
  onClickEdit: (gameEntry: GameEntry) => void;
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
    is_favourite,
    platforms,
    status,
  } = gameEntry;
  const isMobile = useMobile();
  const { ref, hovered } = useHover();
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState<boolean>(false);
  const categorizedPlatforms = categorizePlatforms(platforms ?? []);

  const theme = useMantineTheme();
  const badgeColor = useStatusColor();

  const dispatch = useAppDispatch();

  const handleStatusChange = (newStatus: string) => {
    dispatch(changeGameEntryStatus({ gameEntry, newStatus: Number(newStatus) }))
      .unwrap()
      .then(() => {
        showSuccessNotification({
          title: "Status updated",
          message: gameEntry.game_name,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  const handleUpdateFavorite = (isFavorite: boolean) => {
    if (!isEditable) {
      return;
    }
    dispatch(updateGameEntryFavorite({ gameEntry, isFavorite: isFavorite }))
      .unwrap()
      .then(() => {
        showSuccessNotification({
          title: isFavorite
            ? "Game added to favorites"
            : "Game removed from favorites",
          message: gameEntry.game_name,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  return (
    <div>
      <Card
        p={0}
        style={{
          borderLeft: "10px solid",
          borderColor: badgeColor[status],
          overflow: "visible",
        }}
        mt="lg"
      >
        <Group position="apart">
          <Group style={{ overflow: "hidden" }}>
            <Image
              width={isMobile ? 80 : 200}
              height="auto"
              withPlaceholder
              src={cover}
              sx={{ maxHeight: 120 }}
            />
            <Stack ml={4}>
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
            </Stack>
          </Group>
          <Stack mr="lg">
            <Group sx={{ height: "100%" }} position="right">
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
              {isEditable && !is_favourite && (
                <Tooltip label="Add this game to favorites">
                  <ActionIcon
                    onClick={() => {
                      handleUpdateFavorite(true);
                    }}
                  >
                    <AiOutlineStar size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              {is_favourite && (
                <Tooltip
                  label={isEditable ? "Remove this game from favorites" : ""}
                >
                  <ActionIcon
                    onClick={() => {
                      handleUpdateFavorite(false);
                    }}
                  >
                    <AiFillStar size={18} color={theme.colors.yellow[5]} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            {isEditable && (
              <Group>
                <Select
                  value={String(status)}
                  data={STATUS_DATA}
                  onChange={handleStatusChange}
                />
                <Tooltip label="Edit game entry">
                  <ActionIcon
                    onClick={() => {
                      onClickEdit(gameEntry);
                    }}
                  >
                    <TbEdit size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
            {/* <Menu position="bottom-end">
                <Menu.Target>
                  <Anchor align="right">Update status</Anchor>
                </Menu.Target>

                <Menu.Dropdown>
                  {Object.keys(GameEntryStatus)
                    .filter((v) => !isNaN(Number(v)))
                    .map((value) => {
                      return (
                        <Menu.Item key={value}>
                          {gameEntryStatusToString(
                            value as unknown as GameEntryStatus
                          )}
                        </Menu.Item>
                      );
                    })}
                </Menu.Dropdown>
              </Menu> */}
          </Stack>
        </Group>
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
