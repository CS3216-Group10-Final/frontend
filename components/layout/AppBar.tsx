import { logoutApi } from "@api/authentication/authentication_api";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
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
import { useMobile } from "utils/useMobile";
import AuthModal from "./AuthModal";
import UserSearch from "./UserSearch";

const AppBar = () => {
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const isMobile = useMobile();

  const handleClose = () => {
    setAuthModalIsOpen(false);
  };

  const handleClick = () => {
    if (user) {
      openConfirmModal({
        title: "Logout",
        children: <Text size="sm">Are you sure you want to log out?</Text>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: () => logout(),
      });
    } else {
      setAuthModalIsOpen(true);
    }
  };

  const logout = () => {
    logoutApi()
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        dispatch({ type: "USER_LOGOUT" });
      });
  };

  return (
    <Header
      height={60}
      p="sm"
      style={{ backgroundColor: theme.colors.dark[7] }}
      zIndex="100"
    >
      <Group sx={{ height: "100%" }} position="apart">
        <Group>
          <Link href={user ? `/user/${user.username}` : "/"}>
            <Image
              src="/logo-transparent.png"
              alt="Logo"
              width={30}
              style={{ cursor: "pointer" }}
            />
          </Link>
          {isMobile || (
            <Link href={user ? `/user/${user.username}` : "/"}>
              <Group spacing={0}>
                <Text
                  size="lg"
                  weight="bold"
                  variant="gradient"
                  gradient={{ from: "yellow", to: "orange" }}
                  style={{ fontFamily: "Quicksand", cursor: "pointer" }}
                >
                  DisplayCase
                </Text>
              </Group>
            </Link>
          )}
          <Space h="lg" />
          <Link href="/games">
            <Text style={{ cursor: "pointer" }} weight="bold">
              Games
            </Text>
          </Link>
          {user && (
            <Link href="/timeline">
              <Text style={{ cursor: "pointer" }} weight="bold">
                Timeline
              </Text>
            </Link>
          )}
        </Group>
        <Group>
          {user && !isMobile && <UserSearch />}
          {user && (
            <Link href={`/user/${user.username}`}>
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
