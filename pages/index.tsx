import OnboardingPage from "@components/OnboardingPage";
import PageHeader from "@components/PageHeader";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const user = useAppSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/user/${user.username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <PageHeader
        title={"Welcome"}
        description={"Show off your game collection with DisplayCase"}
      />
      <OnboardingPage />
    </>
  );
};

export default Home;
