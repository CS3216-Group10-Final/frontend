import {
  Box,
  Center,
  Group,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconArchive, IconChartLine, IconUsers } from "@tabler/icons";

const OnboardingPage = () => {
  const theme = useMantineTheme();

  return (
    <Center mt="xl" sx={{ width: "80%" }} m="auto">
      <Box>
        <Title size={40} weight={700} align="center">
          Get your best personal
          <br />
          game archive with
          <br />
        </Title>
        <Title
          mt={40}
          mb={40}
          align="center"
          size={80}
          weight={800}
          color={theme.fn.primaryColor()}
        >
          DisplayCase
        </Title>

        <Group mt="xl">
          <IconArchive />

          <Text align="center" size="xl">
            Keep track of games that you have.
          </Text>
        </Group>

        <Group mt="xl">
          <IconChartLine />

          <Text align="center" size="xl">
            Personalised statistics of games you played.
          </Text>
        </Group>

        <Group mt="xl">
          <IconUsers />

          <Text align="center" size="xl">
            Share your profile with your friends.
          </Text>
        </Group>
      </Box>
    </Center>
  );
};

export default OnboardingPage;
