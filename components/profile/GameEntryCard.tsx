/* eslint-disable jsx-a11y/alt-text */
import { Card, Image, Text, Group } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type Props = {
  title: string;
  cover: string;
  rating?: number;
  onClick?: () => void;
};

const GameEntryCard = (props: Props) => {
  const { title, cover, rating, onClick } = props;
  const { hovered, ref } = useHover();

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
            <Image width={180} height={72} src={cover} withPlaceholder />
            <Text size="xl" weight={500}>
              {title}
            </Text>
          </Group>
          {rating && (
            <Text size="xl" mr={24} weight={500}>
              {rating}/10
            </Text>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
};

export default GameEntryCard;
