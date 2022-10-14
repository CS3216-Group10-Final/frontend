import TokenService from "@api/authentication/token_service";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { AppShell, Container } from "@mantine/core";
import { useAppDispatch } from "@redux/hooks";
import { getSelfUser } from "@redux/slices/User_slice";
import React from "react";
import AppBar from "./AppBar";

const Layout = ({ children }: React.PropsWithChildren) => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (
      TokenService.getLocalAccessToken() &&
      TokenService.getLocalRefreshToken()
    ) {
      dispatch(getSelfUser()).catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
    }
  }, [dispatch]);

  return (
    <AppShell
      padding="md"
      header={<AppBar />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[5] },
      })}
    >
      <Container mb={128}>{children}</Container>
    </AppShell>
  );
};

export default Layout;
