import PageHeader from "@components/PageHeader";
import ProfilePage from "@components/profile";
import { LoadingOverlay } from "@mantine/core";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { username } = context.query;

  return {
    props: {
      username: username as string,
    },
  };
};

const UserProfilePage = ({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title={username ? `${String(username)}'s Profile` : "Loading..."}
        description={`View ${String(username)}'s Game Collection `}
      />
      <LoadingOverlay visible={!router.isReady} />
      <ProfilePage username={username as string} />
    </>
  );
};

export default UserProfilePage;
