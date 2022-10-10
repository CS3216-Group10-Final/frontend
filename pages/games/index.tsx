import { getGameListApi } from "@api/games_api";
import { Game } from "@api/types";
import GameCard from "@components/GameCard";
import PageHeader from "@components/PageHeader";
import {
  Center, Pagination,
  SimpleGrid,
  Space,
  Text,
  TextInput
} from "@mantine/core";
import { useDebouncedValue, useIsomorphicEffect } from "@mantine/hooks";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const GamesList: NextPage = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300)

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
      <TextInput placeholder="Search" icon={<AiOutlineSearch/>} value={searchTerm} onChange={(event: ChangeEvent) => setSearchTerm((event.currentTarget as HTMLInputElement).value)}/>
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
        <Pagination total={totalPage} page={activePage} onChange={loadPage}  />
      </Center>
    </>
  );
};

export default GamesList;
