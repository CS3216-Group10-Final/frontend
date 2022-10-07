import PageHeader from "@components/PageHeader";
import { Input, Text } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import type { NextPage } from "next";

const Games: NextPage = () => {
  return (
    <>
      <PageHeader
        title="Games"
        description="Search for games to add to your DisplayCase"
      />
      <Text>Games page</Text>
      <Input placeholder="Search" icon={<AiOutlineSearch />} />
    </>
  );
};

export default Games;
