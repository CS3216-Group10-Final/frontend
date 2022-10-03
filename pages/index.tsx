import { AppShell, Navbar, Header, Text, Group, Button } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import AppBar from "../components/AppBar";
import PageHeader from "../components/PageHeader";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <PageHeader title="DisplayCase" description="Display" />
      <AppShell
        padding="md"
        header={<AppBar />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colors.dark[8] },
        })}
      >
        <Text>La</Text>
      </AppShell>
    </>
  );
};

export default Home;
