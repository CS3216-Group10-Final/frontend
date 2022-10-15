import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import ChartBarDistribution from "@components/profile/ChartBarDistribution";
import GameSection from "@components/profile/GameSection";
import { useForm } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";
import {
  Avatar,
  Button,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getSelfUserStatistics,
  selectUserStatistics,
} from "@redux/slices/UserStatistics_slice";
import { selectUser, updateUsername } from "@redux/slices/User_slice";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";
import UploadProfileModal from "./UploadProfileModal";
// import { GameEntryStatus, Genre, Platform } from "@api/types";

// const game_status_distribution: Record<GameEntryStatus, number> = {
//   [GameEntryStatus.WISHLIST]: 10,
//   [GameEntryStatus.BACKLOG]: 15,
//   [GameEntryStatus.PLAYING]: 12,
//   [GameEntryStatus.COMPLETED]: 100,
//   [GameEntryStatus.DROPPED]: 50,
// };

// const game_genre_distribution: Partial<Record<Genre, number>> = {
//   FPS: 12,
//   MMORPG: 11,
//   MOBA: 3,
//   OTHERS: 40,
// };

// const platform_distribution: Partial<Record<Platform, number>> = {
//   PC: 100,
//   Playstation: 5,
// };

// const play_year_distribution: Record<number, number> = {
//   2001: 10,
//   2002: 15,
//   2003: 12,
//   2004: 11,
//   2005: 21,
// };

// const release_year_distribution: Record<number, number> = {
//   2001: 5,
//   2002: 21,
//   2003: 13,
//   2004: 43,
//   2005: 11,
//   2006: 12,
//   2007: 11,
//   2008: 14,
// };

const UsernameModalContent = () => {
  interface UsernameForm {
    username: string;
  }
  const dispatch = useAppDispatch();
  const usernameForm = useForm<UsernameForm>({
    initialValues: {
      username: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username"),
    },
  });

  const handleUpdateUsername = ({ username }: UsernameForm) => {
    dispatch(updateUsername(username))
      .then(() => {
        showSuccessNotification({
          title: "Username updated",
          message: "Awesome!",
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => closeAllModals());
  };

  return (
    <form onSubmit={usernameForm.onSubmit(handleUpdateUsername)}>
      <TextInput
        label="Enter your username"
        placeholder="Username"
        withAsterisk
        {...usernameForm.getInputProps("username")}
      />
      <Space h="md" />
      <Button type="submit" fullWidth>
        Change
      </Button>
    </form>
  );
};

const ProfilePage = () => {
  const user = useAppSelector(selectUser);
  const userStatistics = useAppSelector(selectUserStatistics);
  const dispatch = useAppDispatch();

  const [profilePicModalIsOpen, setProfilePicModalIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getSelfUserStatistics()).catch((error) => {
      showApiRequestErrorNotification(handleApiRequestError(error));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openChangeUserNameModal = () => {
    openModal({
      title: "Change username",
      children: <UsernameModalContent />,
    });
  };

  return (
    <>
      <Grid grow>
        <Grid.Col md={3} sm={12}>
          <Stack
            sx={{ height: "100%", maxWidth: 200, margin: "auto" }}
            justify="center"
          >
            <Avatar
              src={user?.profile_picture_link}
              size={160}
              radius={18}
              mx="auto"
            />
            <Text size="xl" align="center" mb={8} color="white">
              {user?.username}
            </Text>
            <Button onClick={openChangeUserNameModal}>Change Username</Button>
            <Button onClick={() => setProfilePicModalIsOpen(true)}>
              Upload Picture
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col md={9} sm={12} mt="md">
          <Title order={1} align="center">
            Statistics
          </Title>
          {userStatistics && (
            <Text align="center">
              Average rating: {userStatistics.average_rating.toFixed(1)}/10
            </Text>
          )}
          {userStatistics && (
            <Group mt={36} align="center" grow>
              <ChartBarDistribution
                gameStatusDistribution={userStatistics.game_status_distribution}
                gameGenreDistribution={userStatistics.game_genre_distribution}
                platformDistribution={userStatistics.platform_distribution}
                releaseYearDistribution={
                  userStatistics.release_year_distribution
                }
                playYearDistribution={userStatistics.play_year_distribution}
              />
            </Group>
          )}
        </Grid.Col>
        <Grid.Col span={12} mt="md">
          <GameSection />
        </Grid.Col>
      </Grid>
      <UploadProfileModal
        opened={profilePicModalIsOpen}
        onClose={() => setProfilePicModalIsOpen(false)}
      />
    </>
  );
};

export default ProfilePage;
