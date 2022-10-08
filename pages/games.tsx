import PageHeader from "@components/PageHeader";
import { Center, Input, SimpleGrid, Space, Text } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import type { NextPage } from "next";
import GameCard from "@components/GameCard";

const Games: NextPage = () => {
  const testArray = Array.from({ length: 8 }, (x, i) => i);
  return (
    <>
      <PageHeader
        title="Games"
        description="Search for games to add to your DisplayCase"
      />
      <Center>
        <Text size="xl">Games</Text>
      </Center>
      <Input placeholder="Search" icon={<AiOutlineSearch />} />
      <Space h="md" />
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
      >
        {testArray.map((val) => {
          return (
            <GameCard
              game={{
                id: 4,
                name: "Space Quest 6: The Spinal Frontier",
                cover:
                  "//images.igdb.com/igdb/image/upload/t_1080p/mrpip4oeuvf9a1rgrtnq.jpg",
              }}
              key={val}
            />
          );
        })}
        {testArray.map((val) => {
          return (
            <GameCard
              game={{
                id: 3,
                name: "System Shock 2",
                cover: "//images.igdb.com/igdb/image/upload/t_1080p/co4bak.jpg",
              }}
              key={val}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default Games;
