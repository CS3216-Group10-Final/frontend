import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameListApi, getPopularGameListApi } from "@api/games_api";
import { Game, GameFilter } from "@api/types";
import FilterModal from "@components/FilterModal";
import GameCard from "@components/GameCard";
import PageHeader from "@components/PageHeader";
import { Carousel } from "@mantine/carousel";
import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  Pagination,
  SimpleGrid,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { getGameEntries } from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import type { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineFire, AiOutlineSearch } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { PLATFORM_CATEGORY_MAPPINGS } from "utils/platform_categories";
import { useMobile } from "utils/useMobile";

const GamesList: NextPage = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [gameFilter, setGameFilter] = useState<GameFilter>({
    release_years: new Set(),
    platforms: new Set(),
    genres: new Set(),
  });
  const [filterModalIsOpen, setFilterModalIsOpen] = useState<boolean>(false);

  const isMobile = useMobile();
  const selfUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selfUser) {
      dispatch(getGameEntries({ user_id: selfUser.id }))
        .unwrap()
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfUser]);

  useEffect(() => {
    setIsLoading(true);
    getGameListApi({
      page: activePage,
      query: debouncedSearchTerm,
      release_years: Array.from(gameFilter.release_years.values()),
      platforms: Array.from(gameFilter.platforms.values())
        .map((category) =>
          Array.from(PLATFORM_CATEGORY_MAPPINGS[category].values())
        )
        .flat(),
      genres: Array.from(gameFilter.genres.values()),
    })
      .then(({ games, totalPage }) => {
        setGames(games);
        setTotalPage(totalPage ? totalPage : 0);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
        setGames([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    setIsLoading(true);
    getGameListApi({
      page: 1,
      query: debouncedSearchTerm,
      release_years: Array.from(gameFilter.release_years.values()),
      platforms: Array.from(gameFilter.platforms.values())
        .map((category) =>
          Array.from(PLATFORM_CATEGORY_MAPPINGS[category].values())
        )
        .flat(),
      genres: Array.from(gameFilter.genres.values()),
    })
      .then(({ games, totalPage }) => {
        setGames(games);
        setTotalPage(totalPage ? totalPage : 0);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
        setGames([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setActivePage(1);
  }, [debouncedSearchTerm, gameFilter]);

  const loadPage = (page: number) => {
    setActivePage(page);
  };

  useEffect(() => {
    getPopularGameListApi()
      .then((games) => {
        setPopularGames(games);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
        setPopularGames([]);
      });
  }, []);

  return (
    <>
      <PageHeader
        title="Games"
        description="Search for games to add to your DisplayCase"
      />
      {popularGames.length > 0 && (
        <>
          <Group position="center">
            <AiOutlineFire size={28} />
            <Title size={28}>Popular New Releases</Title>
          </Group>
          <Space h="md" />
          <Carousel
            slideSize={isMobile ? "60%" : "25%"}
            height={300}
            slideGap="md"
            draggable={false}
            controlSize={40}
            loop
          >
            {popularGames.map((game) => {
              return (
                <Carousel.Slide key={game.id}>
                  <GameCard game={game} />
                </Carousel.Slide>
              );
            })}
          </Carousel>
        </>
      )}
      <Group position="center">
        <IoGameController size={28} />
        <Title>Games</Title>
      </Group>
      <Space h="md" />
      <Group style={{ width: "100%" }}>
        <TextInput
          placeholder="Search"
          icon={<AiOutlineSearch />}
          value={searchTerm}
          onChange={(event: ChangeEvent) =>
            setSearchTerm((event.currentTarget as HTMLInputElement).value)
          }
          style={{ flexGrow: 1 }}
        />
        <Button
          leftIcon={<FiFilter />}
          onClick={() => setFilterModalIsOpen(true)}
        >
          Filter
        </Button>
      </Group>
      <Space h="md" />
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayBlur={1} zIndex="1" />
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: 840, cols: 3, spacing: "md" },
            { maxWidth: 620, cols: 2, spacing: "sm" },
          ]}
        >
          {games.map((game) => {
            return <GameCard game={game} key={game.id} />;
          })}
        </SimpleGrid>
      </div>
      <Space h="lg" />
      <Center>
        <Pagination
          total={totalPage}
          page={activePage}
          onChange={loadPage}
          size={isMobile ? "sm" : "md"}
        />
      </Center>
      <FilterModal
        isOpen={filterModalIsOpen}
        onClose={() => setFilterModalIsOpen(false)}
        gameFilter={gameFilter}
        setGameFilter={(gameFilter) => setGameFilter(gameFilter)}
      />
    </>
  );
};

export default GamesList;
