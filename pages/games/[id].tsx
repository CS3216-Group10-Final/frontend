import { NextPage } from "next";
import { useRouter } from "next/router";
import { Text } from "@mantine/core";

const Games: NextPage = () => {
  const { id } = useRouter().query;
  return (
    <>
      <Text>{id}</Text>
    </>
  );
};

export default Games;
