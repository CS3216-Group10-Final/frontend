import { BadgeEntry } from "@api/types";
import { Card, createStyles, Popover, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  badge: BadgeEntry;
}
const useStyles = createStyles(() => {
  return {
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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
        <Card p="lg" shadow="lg" radius="md">
          <div
            onMouseEnter={open}
            onMouseLeave={close}
            className={classes.image}
            style={{ backgroundImage: `url(${badge.badge_picture})` }}
          />
        </Card>
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
            Achieved on {badge.time_achieved.toDateString()}
          </Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Badge;
