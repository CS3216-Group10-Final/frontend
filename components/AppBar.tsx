import { logoutApi } from "@api/authentication/authentication_api";
import { handleApiRequestError } from "@api/error_handling";
import { Button, Group, Header, Text, useMantineTheme } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import { useState } from "react";
import AuthModal from "./AuthModal";

const AppBar = () => {
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  const handleClose = () => {
    setAuthModalIsOpen(false);
  };

  const handleClick = () => {
    if (user) {
      setAuthModalIsOpen(true);
    } else {
      logout();
    }
  };

  const logout = () => {
    logoutApi()
      .catch((error) => {
        // TODO error handling
        console.log(handleApiRequestError(error));
      })
      .finally(() => {
        dispatch({ type: "USER_LOGOUT" });
      });
  };

  return (
    <Header
      height={60}
      p="sm"
      style={{ backgroundColor: theme.colors.dark[6] }}
    >
      <Group sx={{ height: "100%" }} position="apart">
        <Text>Logo</Text>
        <Button onClick={handleClick}>{user ? "Login" : "Logout"}</Button>
      </Group>
      <AuthModal opened={authModalIsOpen} onClose={handleClose} />
    </Header>
  );
};

export default AppBar;
