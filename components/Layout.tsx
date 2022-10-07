import { AppShell, Container } from "@mantine/core";
import React from "react";
import AppBar from "./AppBar";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <AppShell
      padding="md"
      header={<AppBar />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[5] },
      })}
    >
      <Container>{children}</Container>
    </AppShell>
  );
};

export default Layout;
