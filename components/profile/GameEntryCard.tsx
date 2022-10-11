/* eslint-disable jsx-a11y/alt-text */
import { GameEntry, GameEntryStatus } from "@api/types";
import { Card, Image, Text, Group, Stack, Badge } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type Props = {
  gameEntry: GameEntry;
  onClick?: () => void;
};

const GameEntryCard = (props: Props) => {
  const { gameEntry, onClick } = props;
  const { game_name: title, game_cover: cover, rating, status } = gameEntry;
  const { hovered, ref } = useHover();

  const badgeColor = {
    [GameEntryStatus.DROPPED]: "red",
    [GameEntryStatus.COMPLETED]: "green",
    [GameEntryStatus.PLAYING]: "yellow",
    [GameEntryStatus.BACKLOG]: "blue",
    [GameEntryStatus.WISHLIST]: "dark",
  };

  return (
    <Card
      sx={(theme) => ({
        cursor: "pointer",
        background: hovered ? theme.colors.dark[3] : theme.colors.dark[6],
      })}
      ref={ref}
      onClick={onClick}
    >
      <Card.Section>
        <Group position="apart">
          <Group>
            <Image width={180} height={80} src={cover} withPlaceholder />
            <Stack>
              <Text mt="sm" size="md" weight={500}>
                {title}
              </Text>
              <Group mb="sm">
                <Badge color={badgeColor[status]}>
                  {GameEntryStatus[status]}
                </Badge>
              </Group>
            </Stack>
          </Group>
          {rating && (
            <Text size="md" mr={24} weight={500}>
              {rating}/10
            </Text>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
};

export default GameEntryCard;
