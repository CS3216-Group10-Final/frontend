import {
  Button,
  Card,
  Center,
  createStyles,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { AiOutlineSearch, AiOutlineStar } from "react-icons/ai";
import { CgGames } from "react-icons/cg";
import { FaGamepad } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { IoGameControllerOutline } from "react-icons/io5";
import { TbArchive, TbChartLine, TbUsers } from "react-icons/tb";
import AuthModal from "./AuthModal";
const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "center",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("xs")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  featureSectionContainer: {
    backgroundColor: theme.colors.dark[3],
    width: "100%",
  },

  featureCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: theme.spacing.xl,

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  featureCard: {
    height: 200,
    width: 300,
    maxWidth: 300,
    borderWidth: 2,

    [theme.fn.smallerThan("md")]: {
      marginTop: 10,
    },
  },
}));
const OnboardingPage = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [isAuthModalOpen, { open, close }] = useDisclosure(false);
  const isScreenSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isScreenMedium = useMediaQuery(
    `(max-width: ${theme.breakpoints.md}px)`
  );
  const alignment = isScreenSmall ? "center" : "right";

  return (
    <>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Text color="dimmed" align={alignment} size={isScreenSmall ? 20 : 26}>
            Show off your game collection with
          </Text>
          <Group position={alignment}>
            <Image
              mt={isScreenSmall ? 3 : 9}
              width={isScreenSmall ? 44 : isScreenMedium ? 50 : 80}
              src={"logo-transparent.png"}
              alt="logo"
            />
            <Title
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              size={isScreenSmall ? 44 : isScreenMedium ? 50 : 80}
              weight={900}
            >
              DisplayCase
            </Title>
          </Group>
          <Group position="right" mt={24}>
            <Text size={isScreenSmall ? 14 : 20}>
              Keep track of games you have played
            </Text>
            <ThemeIcon
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              size={isScreenSmall ? 18 : 30}
            >
              <TbArchive />
            </ThemeIcon>
          </Group>
          <Group position="right" mt={24}>
            <Text size={isScreenSmall ? 14 : 20}>
              View personalised statistics
            </Text>
            <ThemeIcon
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              size={isScreenSmall ? 18 : 30}
            >
              <TbChartLine />
            </ThemeIcon>
          </Group>
          <Group position="right" mt={24}>
            <Text size={isScreenSmall ? 14 : 20}>
              Share your profile with your friends
            </Text>
            <ThemeIcon
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              size={isScreenSmall ? 18 : 30}
            >
              <TbUsers />
            </ThemeIcon>
          </Group>

          <Group position="right">
            <Button
              size={isScreenSmall ? "sm" : "md"}
              mt={30}
              fullWidth={isScreenSmall}
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              onClick={open}
            >
              Get started
            </Button>
          </Group>
        </div>
        {!isScreenSmall && (
          <Center>
            <SimpleGrid cols={2} spacing={24} verticalSpacing="xs">
              <Center>
                <GiConsoleController size={120} />
              </Center>
              <Center>
                <IoGameControllerOutline size={120} />
              </Center>
              <Center>
                <CgGames size={120} />
              </Center>
              <Center>
                <FaGamepad size={120} />
              </Center>
            </SimpleGrid>
          </Center>
        )}
      </div>
      <Stack
        className={classes.featureSectionContainer}
        align="center"
        p="lg"
        mt={isScreenSmall ? 40 : 70}
      >
        <Card
          p={0}
          shadow={`15px 15px 10px ${theme.colors.dark[6]}`}
          style={{ maxWidth: 1000 }}
        >
          <Image src={"/onboarding-demo.png"} alt="Demo image" />
        </Card>
        <Title mt={20} size={isScreenSmall ? 28 : 38} align="center">
          All your games recorded in 1 convenient location
        </Title>
        <div className={classes.featureCardContainer}>
          <Card
            className={classes.featureCard}
            shadow="lg"
            withBorder
            radius="md"
          >
            <Center>
              <AiOutlineSearch size={50} />
            </Center>
            <Divider mt={10}></Divider>
            <Text align="center" mt={20} size={18}>
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "yellow", to: "orange" }}
                inherit
              >
                Browse
              </Text>{" "}
              from over 200,000 games to add to your display case!
            </Text>
          </Card>
          <Card
            className={classes.featureCard}
            shadow="lg"
            withBorder
            radius="md"
          >
            <Center>
              <AiOutlineStar size={50} />
            </Center>
            <Divider mt={10}></Divider>
            <Text align="center" mt={20} size={18}>
              Keep track of which games you have completed and give them a{" "}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "yellow", to: "orange" }}
                inherit
              >
                rating!
              </Text>
            </Text>
          </Card>
          <Card
            className={classes.featureCard}
            shadow="lg"
            withBorder
            radius="md"
          >
            <Center>
              <TbUsers size={50} />
            </Center>
            <Divider mt={10}></Divider>
            <Text align="center" mt={20} size={18}>
              Show off your display case by sending it to your{" "}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "yellow", to: "orange" }}
                inherit
              >
                friends!
              </Text>
            </Text>
          </Card>
        </div>
        <Text size={isScreenSmall ? 20 : 26}>And much more coming soon!</Text>
      </Stack>

      <AuthModal isOpen={isAuthModalOpen} onClose={close} />
    </>
  );
};

export default OnboardingPage;
