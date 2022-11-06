import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getSteamGamesApi, getSteamLoginUrl } from "@api/steam_api";
import { Game, GameEntryStatus } from "@api/types";
import {
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  Select,
  SimpleGrid,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { importAllSteamGames } from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import { useEffect, useState } from "react";
import { FaSteam } from "react-icons/fa";
import { showSuccessNotification } from "utils/notifications";
import { STATUS_DATA } from "utils/status";
import { useMobile } from "utils/useMobile";
import GameCard from "./GameCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SteamModal = ({ isOpen, onClose }: Props) => {
  const user = useAppSelector(selectUser);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(99);
  const [games, setGames] = useState<Game[]>([]);
  const [addAllGamesStatus, setAddAllGamesStatus] = useState<GameEntryStatus>(
    GameEntryStatus.COMPLETED
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isMobile = useMobile();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && user?.steamid) {
      setIsLoading(true);
      getSteamGamesApi({ page: activePage })
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
          showSuccessNotification({
            title: "Games successfully added!",
            message: `Added all games to your DisplayCase!`,
          });
          onClose();
        });
    }
  }, [activePage, isOpen, user, onClose]);

  const loginSteam = () => {
    const steamUrl = getSteamLoginUrl();
    window.open(steamUrl, "_blank");
  };

  const loadPage = (page: number) => {
    setActivePage(page);
  };

  const addAllGamesToDisplayCase = () => {
    setIsLoading(true);
    dispatch(importAllSteamGames({ status: addAllGamesStatus }))
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      title={
        <Group>
          <FaSteam />
          <Text>Steam</Text>
        </Group>
      }
      opened={isOpen}
      onClose={onClose}
      size={isMobile ? "md" : "xl"}
    >
      <Group position="apart">
        <Text>Account Synced: </Text>
        <Text>{user?.personaname ? user.personaname : "None"}</Text>
      </Group>
      <Space h="md" />
      <Group position="right">
        <Button leftIcon={<FaSteam />} variant="default" onClick={loginSteam}>
          Sync New Account
        </Button>
      </Group>
      <Space h="md" />
      <LoadingOverlay visible={isLoading} overlayBlur={1} zIndex="1" />
      {games.length === 0 && user?.steamid && (
        <Title size={18} align="center" mt={15}>
          All games in your Steam library are already in your DisplayCase!
        </Title>
      )}
      {games.length > 0 && user?.steamid && (
        <>
          <Divider />
          <Space h="md" />
          <Title size={22}>Games from your Steam Library</Title>
          <Space h="md" />
          <div style={{ position: "relative" }}>
            <SimpleGrid
              cols={4}
              spacing="lg"
              breakpoints={[{ maxWidth: 755, cols: 2, spacing: "sm" }]}
            >
              {games.map((game) => {
                return (
                  <GameCard
                    game={game}
                    key={game.id}
                    height={isMobile ? 100 : 220}
                    hideTitle={isMobile ? true : false}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    overrideOnClick={() => {}}
                  />
                );
              })}
            </SimpleGrid>
          </div>
          <Space h="lg" />
          <Center>
            <Pagination
              total={totalPage}
              page={activePage}
              onChange={loadPage}
              // size={isMobile ? "sm" : "md"}
            />
          </Center>
          <Space h="md" />
          <Divider />
          <Space h="md" />
          <Group position="apart">
            <Group>
              <Text>Add all games to: </Text>
              <Select
                value={String(addAllGamesStatus)}
                data={STATUS_DATA}
                onChange={(newStatus) =>
                  setAddAllGamesStatus(Number(newStatus))
                }
              />
            </Group>
            <Button onClick={addAllGamesToDisplayCase}>Add All</Button>
          </Group>
        </>
      )}
    </Modal>
  );
};

export default SteamModal;
