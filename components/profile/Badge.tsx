import { BadgeEntry } from "@api/types";
import {
  AspectRatio,
  Card,
  createStyles,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import parseISO from "date-fns/parseISO";

interface Props {
  badge: BadgeEntry;
}
const useStyles = createStyles((theme) => {
  return {
    card: {
      borderColor: theme.colors.yellow[5],
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 2,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    },
  };
});

const Badge = ({ badge }: Props) => {
  const { classes } = useStyles();
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <AspectRatio ratio={1} sx={{ maxWidth: 45 }}>
          <Card shadow="lg" radius="md" withBorder className={classes.card}>
            <div
              onMouseEnter={open}
              onMouseLeave={close}
              className={classes.image}
              style={{
                backgroundImage: `url(${badge.badge_picture})`,
              }}
            />
          </Card>
        </AspectRatio>
      </Popover.Target>
      <Popover.Dropdown sx={{ pointerEvents: "none" }}>
        <Stack>
          <Text size="sm" align="center" weight="bold">
            {badge.badge_name}
          </Text>
          <Text size="sm" align="center">
            {badge.badge_description}
          </Text>
          <Text size="xs" align="center">
            Achieved on{" "}
            {parseISO(badge.time_achieved)?.toDateString() ?? "an unkown date"}
          </Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Badge;
