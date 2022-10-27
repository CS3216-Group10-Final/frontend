/* eslint-disable jsx-a11y/alt-text */
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { GameEntry, GameEntryStatus } from "@api/types";
import ReviewModal from "@components/ReviewModal";
import {
  ActionIcon,
  Card,
  Grid,
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
import { updateGameEntry } from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import { useState } from "react";
import { TbEdit, TbFileText } from "react-icons/tb";
import { showSuccessNotification } from "utils/notifications";
import {
  allPlatformCategories,
  categorizePlatforms,
  getPlatformCategoryIcon,
} from "utils/platform_categories";
import { STATUS_DATA } from "utils/status";
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

  const dispatch = useAppDispatch();

  const handleStatusChange = (newStatus: string) => {
    console.log(newStatus);
    console.log(GameEntryStatus[Number(newStatus)]);

    const newGameEntry: GameEntry = {
      ...gameEntry,
      status: Number(newStatus),
    };

    dispatch(updateGameEntry(newGameEntry))
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
        <Grid align="center" ml={0}>
          <Grid.Col span={3} p={0} style={{ overflow: "hidden" }}>
            <Image
              width="100%"
              height="auto"
              fit="fill"
              withPlaceholder
              src={cover}
              sx={{ maxHeight: 120 }}
            />
          </Grid.Col>
          <Grid.Col span={isMobile ? 5 : 6} p={0} pl="sm">
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
          <Grid.Col span={isMobile ? 4 : 3} p={0}>
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
                {isEditable && (
                  <Tooltip label="Edit game entry">
                    <ActionIcon
                      onClick={() => {
                        onClickEdit && onClickEdit(gameEntry);
                      }}
                    >
                      <TbEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
              <Select
                value={String(status)}
                data={STATUS_DATA}
                onChange={handleStatusChange}
              />
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
