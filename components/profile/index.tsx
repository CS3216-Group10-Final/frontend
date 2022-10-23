import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { followUserApi, unfollowUserApi } from "@api/follow_api";
import { User, UserStatistics } from "@api/types";
import { getUserApi } from "@api/users_api";
import { getUserStatisticsByNameApi } from "@api/user_statistics_api";
import GameSection from "@components/profile/GameSection";
import {
  Avatar,
  Button,
  Grid,
  LoadingOverlay,
  SegmentedControl,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { selectUser, updateUsername } from "@redux/slices/User_slice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";
import ActivitySection from "./ActivitySection";
import Badge from "./Badge";
import StatisticsSection from "./StatisticsSection";
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
  const router = useRouter();

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
      .unwrap()
      .then(() => {
        showSuccessNotification({
          title: "Username updated",
          message: "Awesome!",
        });

        router.replace(`/user/${username}`);
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

type Props = {
  username: string;
};

enum Section {
  STATISTICS = "Statistics",
  GAMES = "Games",
  ACTIVITY = "Activity",
}

const ProfilePage = (props: Props) => {
  const { username } = props;

  const selfUser = useAppSelector(selectUser);
  const isSelfProfilePage = selfUser?.username === username;

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // TODO: refactor to context
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(
    null
  );
  const [activeSection, setActiveSection] = useState(Section.GAMES);

  const [profilePicModalIsOpen, setProfilePicModalIsOpen] = useState(false);

  async function updateUserStatistics(username: string) {
    getUserStatisticsByNameApi(username)
      .then((apiUserStatistics) => {
        setUserStatistics(apiUserStatistics);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  }
  const segmentedControlData = (
    Object.keys(Section) as (keyof typeof Section)[]
  ).map((key) => {
    return { label: Section[key], value: Section[key] };
  });

  useEffect(() => {
    if (username === undefined) {
      return;
    }
    setIsLoading(true);

    const userPromise = getUserApi(username, selfUser === undefined)
      .then((apiUser) => {
        setUser(apiUser);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });

    const userStatisticsPromise = updateUserStatistics(username);

    Promise.all([userPromise, userStatisticsPromise]).finally(() => {
      setIsLoading(false);
    });
  }, [username, selfUser]);

  const openChangeUserNameModal = () => {
    openModal({
      title: "Change username",
      children: <UsernameModalContent />,
    });
  };

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!user) {
    // TODO: return 404 Not Found Page
    return <Text>404 Not Found</Text>;
  }

  const toggleFollowing = () => {
    if (user.is_following) {
      unfollowUserApi(user.username);
      setUser({ ...user, is_following: false });
    } else {
      followUserApi(user.username);
      setUser({ ...user, is_following: true });
    }
  };

  const SectionComponent = {
    [Section.STATISTICS]: (
      <StatisticsSection user={user} userStatistics={userStatistics} />
    ),
    [Section.GAMES]: (
      <GameSection
        user={user}
        isSelfUser={isSelfProfilePage}
        updateUserStatistics={updateUserStatistics}
      />
    ),
    [Section.ACTIVITY]: <ActivitySection user={user} />,
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
            {isSelfProfilePage && (
              <>
                <Button onClick={openChangeUserNameModal}>
                  Change Username
                </Button>
                <Button onClick={() => setProfilePicModalIsOpen(true)}>
                  Upload Picture
                </Button>
              </>
            )}
            {!isSelfProfilePage && selfUser && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  variant={user.is_following ? "filled" : "outline"}
                  style={{ width: "70%" }}
                  onClick={toggleFollowing}
                >
                  {user.is_following ? "Following" : "+ Follow"}
                </Button>
              </div>
            )}
            <SimpleGrid cols={3} spacing="xs">
              {(user.badges ?? []).map((badge) => {
                return <Badge key={badge.id} badge={badge} />;
              })}
            </SimpleGrid>
          </Stack>
        </Grid.Col>
        <Grid.Col span={12} mt="md">
          <Stack align="center">
            <SegmentedControl
              size="md"
              value={activeSection}
              onChange={(value) => setActiveSection(value as Section)}
              data={segmentedControlData}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={12} mt="xs">
          {SectionComponent[activeSection]}
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
