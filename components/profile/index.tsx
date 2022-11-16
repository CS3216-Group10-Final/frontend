import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { followUserApi, unfollowUserApi } from "@api/follow_api";
import { User, UserStatistics } from "@api/types";
import { getUserApi } from "@api/users_api";
import { getUserStatisticsByNameApi } from "@api/user_statistics_api";
import GameSection from "@components/profile/GameSection";
import SteamModal from "@components/profile/SteamModal";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import { useEffect, useState } from "react";
import { AiOutlineCamera, AiOutlineEdit } from "react-icons/ai";
import { FaSteam } from "react-icons/fa";
import { useMobile } from "utils/useMobile";
import ActivitySection from "./ActivitySection";
import Badge from "./Badge";
import {
  BioModalContent,
  UploadProfileModal,
  UsernameModalContent,
} from "./ProfilePageModals";
import StatisticsSection from "./StatisticsSection";

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
  const isMobile = useMobile();

  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(
    null
  );
  const [activeSection, setActiveSection] = useState(Section.GAMES);

  const [profilePicModalIsOpen, setProfilePicModalIsOpen] = useState(false);
  const [steamModalIsOpen, setSteamModalIsOpen] = useState(false);

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
  const openChangeBioModal = () => {
    openModal({
      title: "Change bio",
      children: <BioModalContent />,
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
    [Section.ACTIVITY]: <ActivitySection user={user} isTimeline={false} />,
  };

  return (
    <>
      <Grid grow>
        <Grid.Col md={3} sm={12}>
          <Grid grow>
            <Grid.Col sm={4}>
              <Stack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
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
                {!isSelfProfilePage && selfUser && (
                  <Button
                    variant={user.is_following ? "filled" : "outline"}
                    style={{ width: "70%" }}
                    onClick={toggleFollowing}
                  >
                    {user.is_following ? "Following" : "+ Follow"}
                  </Button>
                )}
                <SimpleGrid cols={3} spacing="xs" style={{ width: "70%" }}>
                  {(user.badges ?? []).map((badge) => {
                    return <Badge key={badge.id} badge={badge} />;
                  })}
                </SimpleGrid>
              </Stack>
            </Grid.Col>
            <Grid.Col
              sm={8}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Card style={{ flex: 1, position: "relative" }}>
                {isSelfProfilePage && (
                  <ActionIcon
                    style={{ position: "absolute", top: 8, right: 8 }}
                    color="primary"
                    variant="filled"
                    component="a"
                    onClick={openChangeBioModal}
                    sx={{
                      width: 28,
                      height: 28,
                      zIndex: 2,
                    }}
                  >
                    <AiOutlineEdit size={22} />
                  </ActionIcon>
                )}
                <Title size={24} mb={5}>
                  Bio
                </Title>
                {!user.bio && (
                  <Text color="dimmed" italic>
                    No bio added yet.
                  </Text>
                )}
                {user.bio && (
                  <ScrollArea
                    style={{ height: 180, maxWidth: isMobile ? 300 : 550 }}
                  >
                    <Text>{user.bio}</Text>
                  </ScrollArea>
                )}
              </Card>
              {isSelfProfilePage && (
                <Group position={isMobile ? "center" : "right"} mt={12}>
                  <Button
                    leftIcon={<FaSteam />}
                    variant="default"
                    onClick={() => {
                      setSteamModalIsOpen(true);
                    }}
                  >
                    Sync Steam
                  </Button>
                  <Button
                    onClick={openChangeUserNameModal}
                    leftIcon={<AiOutlineEdit />}
                  >
                    Change Username
                  </Button>
                  <Button
                    onClick={() => setProfilePicModalIsOpen(true)}
                    leftIcon={<AiOutlineCamera />}
                  >
                    Upload Picture
                  </Button>
                </Group>
              )}
            </Grid.Col>
          </Grid>
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
      <SteamModal
        isOpen={steamModalIsOpen}
        onClose={() => setSteamModalIsOpen(false)}
      />
    </>
  );
};

export default ProfilePage;
