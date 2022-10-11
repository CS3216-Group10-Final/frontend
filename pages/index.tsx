import OnboardingPage from "@components/OnboardingPage";
import PageHeader from "@components/PageHeader";
import ProfilePage from "@components/profile";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import type { NextPage } from "next";

const Home: NextPage = () => {
  // TODO: integrate with redux
  const user = useAppSelector(selectUser);

  return (
    <>
      <PageHeader
        title={user ? user.username : "Welcome"}
        description={user ? `${user.username}'s profile page` : "Onboard page"}
      />
      {user ? <ProfilePage /> : <OnboardingPage />}
    </>
  );
};

export default Home;
