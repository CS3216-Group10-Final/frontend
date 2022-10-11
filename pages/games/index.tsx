import { getGameListApi } from "@api/games_api";
import { Game } from "@api/types";
import GameCard from "@components/GameCard";
import PageHeader from "@components/PageHeader";
import {
  Center,
  LoadingOverlay,
  Pagination,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useIsomorphicEffect } from "@mantine/hooks";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const GamesList: NextPage = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useIsomorphicEffect(() => {
    setIsLoading(true);
    getGameListApi({ page: activePage, query: debouncedSearchTerm })
      .then(({ games, totalPage }) => {
        setGames(games);
        setTotalPage(totalPage ? totalPage : 0);
      })
      .catch((error) => {
        //TODO Error handling
        setGames([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activePage]);

  useIsomorphicEffect(() => {
    setIsLoading(true);
    getGameListApi({ page: 1, query: debouncedSearchTerm })
      .then(({ games, totalPage }) => {
        setGames(games);
        setTotalPage(totalPage ? totalPage : 0);
      })
      .catch((error) => {
        //TODO Error handling
        setGames([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setActivePage(1);
  }, [debouncedSearchTerm]);

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
      <TextInput
        placeholder="Search"
        icon={<AiOutlineSearch />}
        value={searchTerm}
        onChange={(event: ChangeEvent) =>
          setSearchTerm((event.currentTarget as HTMLInputElement).value)
        }
      />
      <Space h="md" />
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayBlur={1} zIndex="1" />
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
      </div>
      <Space h="lg" />
      <Center>
        <Pagination total={totalPage} page={activePage} onChange={loadPage} />
      </Center>
    </>
  );
};

export default GamesList;
