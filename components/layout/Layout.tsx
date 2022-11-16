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
import AppFooter from "./AppFooter";

interface Props {
  children: React.ReactNode;
  fullWidth: boolean;
}

const Layout = ({ children, fullWidth }: Props) => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (
      TokenService.getLocalAccessToken() &&
      TokenService.getLocalRefreshToken()
    ) {
      dispatch(getSelfUser())
        .unwrap()
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    }
  }, [dispatch]);

  return (
    <AppShell
      padding={fullWidth ? 0 : "md"}
      header={<AppBar />}
      footer={<AppFooter />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[5] },
      })}
    >
      <Container
        mb={128}
        style={fullWidth ? { width: "100%", maxWidth: "100%", padding: 0 } : {}}
      >
        {children}
      </Container>
    </AppShell>
  );
};

export default Layout;
