import PageHeader from "@components/PageHeader";
import {
  Center,
  Input,
  Pagination,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import type { NextPage } from "next";
import GameCard from "@components/GameCard";
import { useState } from "react";
import { Game } from "@api/types";
import { useIsomorphicEffect } from "@mantine/hooks";
import { getGameListApi } from "@api/games_api";

const GamesList: NextPage = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);
  const [games, setGames] = useState<Game[]>([]);

  useIsomorphicEffect(() => {
    getGameListApi({ page: activePage, query: "" })
      .then(({ games, totalPage }) => {
        setGames(games);
        setTotalPage(totalPage ? totalPage : 0);
      })
      .catch((error) => {
        //TODO Error handling
        setGames([]);
      });
  }, [activePage]);

  const loadPage = (page: number) => {
    setActivePage(page);
  };

  return (
    <>
      <PageHeader
        title="Games"
        description="Search for games to add to your DisplayCase"
      />
      <Center>
        <Text size="xl">Games</Text>
      </Center>
      <Space h="md" />
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
        {games.map((game) => {
          return <GameCard game={game} key={game.id} />;
        })}
      </SimpleGrid>
      <Space h="lg" />
      <Center>
        <Pagination total={totalPage} page={activePage} onChange={loadPage} />
      </Center>
    </>
  );
};

export default GamesList;
