import ProfilePage from "@components/profile";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  if (!router.isReady) {
    return <LoadingOverlay visible={true} />;
  }

  return <ProfilePage username={username as string} />;
};

export default UserProfilePage;
