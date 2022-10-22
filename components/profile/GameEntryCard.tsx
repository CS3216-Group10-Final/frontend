/* eslint-disable jsx-a11y/alt-text */
import { GameEntry, GameEntryStatus } from "@api/types";
import {
  ActionIcon,
  Blockquote,
  Card,
  Grid,
  Group,
  HoverCard,
  Image,
  Modal,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useHover, useMediaQuery } from "@mantine/hooks";
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
    platforms,
    status,
  } = gameEntry;
  const isMobile = useMobile();
  const { ref, hovered } = useHover();
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState<boolean>(false);
  const theme = useMantineTheme();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
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
                {gameEntry.review && (
                  <HoverCard width={100} shadow="md">
                    <HoverCard.Target>
                      <ActionIcon
                        onClick={() => {
                          setReviewModalIsOpen(true);
                        }}
                      >
                        <TbFileText size={30} />
                      </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown p={6}>
                      <Text size="xs" align="center">
                        Read review
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                )}
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
              {rating && (
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
                <ActionIcon
                  mr="sm"
                  onClick={() => {
                    onClickEdit && onClickEdit(gameEntry);
                  }}
                >
                  <TbEdit size={18} />
                </ActionIcon>
              )}
            </Group>
          </Grid.Col>
        </Grid>
        <Modal
          opened={reviewModalIsOpen}
          onClose={() => setReviewModalIsOpen(false)}
          size={isScreenSmall ? "sm" : "lg"}
          withCloseButton={false}
        >
          <>
            <Title align="center" size={30}>
              {gameEntry.game_name}
            </Title>
            <Blockquote
              cite={`- ${username}${
                gameEntry.rating === null || gameEntry.rating === undefined
                  ? ""
                  : `, who gave this game ${rating}/10`
              }`}
            >
              {gameEntry.review}
            </Blockquote>
          </>
        </Modal>
      </Card>
    </div>
  );
};

export default GameEntryCard;
