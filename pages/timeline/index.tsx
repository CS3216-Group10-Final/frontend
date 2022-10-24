import TokenService from "@api/authentication/token_service";
import ActivitySection from "@components/profile/ActivitySection";
import { Loader, Stack, Text } from "@mantine/core";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import { useRouter } from "next/router";
import { useEffect } from "react";

const TimelinePage = () => {
  const user = useAppSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (!TokenService.getTokens()) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {user && <ActivitySection user={user} isTimeline />}
      {!user && (
        <Stack align="center">
          <Text align="center">Redirecting...</Text>
          <Loader />
        </Stack>
      )}
    </>
  );
};

export default TimelinePage;
