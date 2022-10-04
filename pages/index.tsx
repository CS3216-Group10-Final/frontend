import PageHeader from "@components/PageHeader";
import { Text } from "@mantine/core";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <PageHeader title="DisplayCase" description="Display" />
      <Text>Content will be inside here</Text>
    </>
  );
};

export default Home;
