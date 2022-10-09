import { AppShell, Container } from "@mantine/core";
import React from "react";
import AppBar from "./AppBar";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <AppShell
      padding="md"
      header={<AppBar />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[8] },
      })}
    >
      <Container mb={128}>{children}</Container>
    </AppShell>
  );
};

export default Layout;
