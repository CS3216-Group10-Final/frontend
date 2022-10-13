import { logoutApi } from "@api/authentication/authentication_api";
import { handleApiRequestError } from "@api/error_handling";
import {
  Avatar,
  Button,
  Group,
  Header,
  Image,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
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
  console.log();

  const handleClose = () => {
    setAuthModalIsOpen(false);
  };

  const handleClick = () => {
    if (user) {
      openConfirmModal({
        title: 'Logout',
        children: (
          <Text size="sm">
            Are you sure you want to log out?
          </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => logout()
      })
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
                src="/logo-transparent.png"
                alt="Logo"
                width={30}
                style={{ cursor: "pointer" }}
              />
          </Link>
          <Text size="lg" weight="bold" color="yellow.5">DisplayCase</Text>
          <Space h="lg" />
          <Link href="/games">
            <Text style={{ cursor: "pointer" }} weight="bold">
              Games
            </Text>
          </Link>
        </Group>
        <Group>
          {user && (
            <Link href={"/"}>
              <Avatar
                src={user?.profile_picture_link}
                size={35}
                radius={5}
                style={{ cursor: "pointer" }}
              />
            </Link>
          )}
          <Button onClick={handleClick}>{user ? "Logout" : "Login"}</Button>
        </Group>
      </Group>
      <AuthModal isOpen={authModalIsOpen} onClose={handleClose} />
    </Header>
  );
};

export default AppBar;
