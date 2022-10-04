import { Button, Text, Group, Header } from "@mantine/core";
import { useState } from "react";
import AuthModal from "./AuthModal";

const AppBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Header height={60} p="sm">
      <Group sx={{ height: "100%" }} position="apart">
        <Text>Logo</Text>
        <Button onClick={() => setIsOpen(true)}>Login</Button>
      </Group>
      <AuthModal opened={isOpen} onClose={handleClose} />
    </Header>
  );
};

export default AppBar;
