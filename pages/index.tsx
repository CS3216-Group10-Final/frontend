import OnboardingPage from "@components/OnboardingPage";
import PageHeader from "@components/PageHeader";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <PageHeader
        title={user ? user.username : "Welcome"}
        description={
          user
            ? `${user.username}'s profile page`
            : "Show off your game collection with DisplayCase"
        }
      />
      <OnboardingPage />
    </>
  );
};

export default Home;
