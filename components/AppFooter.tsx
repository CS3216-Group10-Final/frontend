import {
  ActionIcon,
  Container,
  createStyles,
  Group,
  MantineGradient,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { IconType } from "react-icons/lib";
import { TbClipboardList } from "react-icons/tb";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

interface IconProps {
  Icon: IconType;
  description: string;
  gradient?: MantineGradient;
  link: string;
}

const SocialIcon = ({ Icon, description, gradient, link }: IconProps) => {
  const theme = useMantineTheme();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const themeIconSize = isScreenSmall ? 28 : 36;
  const iconSize = isScreenSmall ? 20 : 26;
  return (
    <Link href={link}>
      <Tooltip label={description}>
        <ActionIcon variant="gradient" gradient={gradient} size={themeIconSize}>
          <Icon size={iconSize} />
        </ActionIcon>
      </Tooltip>
    </Link>
  );
};

const AppFooter = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  return (
    <div>
      <Container className={classes.inner}>
        <Title
          variant="gradient"
          gradient={{ from: "yellow", to: "orange" }}
          size={isScreenSmall ? 16 : 28}
          weight={900}
        >
          DisplayCase
        </Title>
        <Group position="center" mt={20}>
          <SocialIcon
            Icon={AiOutlineTwitter}
            description={"Twitter"}
            gradient={{ from: "blue", to: "yellow" }}
            link="https://twitter.com/displaycaseme"
          />
          <SocialIcon
            Icon={AiOutlineInstagram}
            description={"Instagram"}
            gradient={{ from: "red", to: "yellow" }}
            link="https://www.instagram.com/displaycase.me/"
          />
          <SocialIcon
            Icon={TbClipboardList}
            description={"Feedback"}
            gradient={{ from: "purple", to: "yellow" }}
            link="https://forms.gle/YLWqS1t2nHtpbyLz8"
          />
        </Group>
      </Container>
    </div>
  );
};

export default AppFooter;
