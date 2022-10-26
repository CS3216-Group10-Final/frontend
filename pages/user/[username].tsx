import PageHeader from "@components/PageHeader";
import ProfilePage from "@components/profile";
import { LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <>
      {username && (
        <PageHeader
          title={username ? `${String(username)}'s Profile` : "Loading..."}
          description={`View ${String(username)}'s Game Collection `}
        />
      )}
      <LoadingOverlay visible={!router.isReady} />
      <ProfilePage username={username as string} />
    </>
  );
};

export default UserProfilePage;
