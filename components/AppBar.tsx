import { logoutApi } from "@api/authentication/authentication_api";
import { handleApiRequestError } from "@api/error_handling";
import {
  Button,
  Group,
  Header,
  Image,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import Link from "next/link";
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
      logout();
    } else {
      setAuthModalIsOpen(true);
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
      zIndex="100"
    >
      <Group sx={{ height: "100%" }} position="apart">
        <Group>
          <Link href="/">
            <Image
              src="logo-transparent.png"
              alt="Logo"
              width={30}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <Space h="md" />
          <Link href="/games">
            <Text style={{ cursor: "pointer" }}>Games</Text>
          </Link>
        </Group>
        <Button onClick={handleClick}>{user ? "Logout" : "Login"}</Button>
      </Group>
      <AuthModal
        isOpen={authModalIsOpen}
        setIsOpen={setAuthModalIsOpen}
        onClose={handleClose}
      />
    </Header>
  );
};

export default AppBar;
