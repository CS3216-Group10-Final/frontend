import { Button, Group, Header, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import AuthModal from "./AuthModal";

const AppBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useMantineTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Header
      height={60}
      p="sm"
      style={{ backgroundColor: theme.colors.dark[6] }}
    >
      <Group sx={{ height: "100%" }} position="apart">
        <Text>Logo</Text>
        <Button onClick={() => setIsOpen(true)}>Login</Button>
      </Group>
      <AuthModal opened={isOpen} onClose={handleClose} />
    </Header>
  );
};

export default AppBar;
