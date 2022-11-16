import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameEntryListApi } from "@api/game_entries_api";
import { GameEntry, GameEntryStatus, User } from "@api/types";
import GridGameEntryCard from "@components/profile/GridGameEntryCard";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Chip,
  Group,
  SimpleGrid,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getAllGameEntriesFiltered,
  getGameEntries,
  selectAllGameEntriesFiltered,
  selectSelfHasGames,
} from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsFillGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { TbPlus } from "react-icons/tb";
import {
  gameEntryStatusToString,
  GAME_SECTION_ORDER,
  LIST_OF_STATUSES,
  STATUS_MANTINE_COLOR,
} from "utils/status";
import { useMobile } from "utils/useMobile";
import GameEntryCard from "./GameEntryCard";
import GameEntryEditModal from "./GameEntryEditModal";

type Props = {
  user: User;
  isSelfUser: boolean;
  updateUserStatistics: (_: string) => Promise<void>;
};
const GameSection = (props: Props) => {
  const dispatch = useAppDispatch();

  const { user, isSelfUser, updateUserStatistics } = props;
  const userId = user.id;
  const selfHasGames = useAppSelector(selectSelfHasGames);
  const selfFilteredGames = useAppSelector(selectAllGameEntriesFiltered);

  const [otherHasGames, setOtherHasGames] = useState<boolean>(false);
  const [otherFilteredGames, setOtherFilteredGames] = useState<
    Record<GameEntryStatus, GameEntry[]>
  >({ 0: [], 1: [], 2: [], 3: [], 4: [] });

  const [sectionViewMode, setSectionViewMode] = useState<string>("list");

  const [isOpen, setIsOpen] = useState(false);
  const [gameEntryModalData, setGameEntryModalData] =
    useState<GameEntry | null>(null);

  const handleClose = () => {
    setGameEntryModalData(null);
    updateUserStatistics(user.username);
    setIsOpen(false);
  };

  const handleEdit = (gameEntry: GameEntry) => {
    if (isOpen) {
      return;
    }

    setGameEntryModalData(gameEntry);
    setIsOpen(true);
  };

  const isMobile = useMobile();
  useEffect(() => {
    if (isMobile) {
      setSectionViewMode("grid");
    }
  }, [isMobile]);

  useEffect(() => {
    if (isSelfUser) {
      dispatch(getGameEntries({ user_id: userId }))
        .unwrap()
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    } else {
      getGameEntryListApi({ user_id: userId })
        .then((entries) => {
          setOtherHasGames(entries.length > 0);
          setOtherFilteredGames(getAllGameEntriesFiltered(entries));
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    }
  }, [dispatch, userId, isSelfUser]);

  return (
    <Box>
      <Group position="apart" px={8}>
        <Group spacing="xs">
          {!isMobile && (
            <>
              <ActionIcon
                color="primary"
                variant="filled"
                component="a"
                sx={{
                  width: 28,
                  height: 28,
                }}
                onClick={() => {
                  setSectionViewMode("list");
                }}
              >
                <BsListUl size={24} />
              </ActionIcon>
              <ActionIcon
                color="primary"
                variant="filled"
                component="a"
                sx={{
                  width: 28,
                  height: 28,
                }}
                onClick={() => {
                  setSectionViewMode("grid");
                }}
              >
                <BsFillGrid3X3GapFill size={24} />
              </ActionIcon>
            </>
          )}
        </Group>
        {isSelfUser && selfHasGames && (
          <Link href="/games">
            <Tooltip label="Add games">
              <ActionIcon
                color="primary"
                variant="filled"
                component="a"
                sx={{
                  width: 28,
                  height: 28,
                }}
              >
                <TbPlus size={24} />
              </ActionIcon>
            </Tooltip>
          </Link>
        )}
      </Group>

      {((isSelfUser && selfHasGames) || (!isSelfUser && otherHasGames)) &&
        sectionViewMode === "grid" && (
          <GridGameSections
            isSelfUser={isSelfUser}
            user={user}
            games={isSelfUser ? selfFilteredGames : otherFilteredGames}
            handleEdit={handleEdit}
          />
        )}

      {((isSelfUser && selfHasGames) || (!isSelfUser && otherHasGames)) &&
        sectionViewMode === "list" && (
          <ListGameSections
            isSelfUser={isSelfUser}
            user={user}
            games={isSelfUser ? selfFilteredGames : otherFilteredGames}
            handleEdit={handleEdit}
          />
        )}

      {isSelfUser && !selfHasGames && (
        <>
          <Title align="center" size={isMobile ? 24 : 32}>
            You have no games added yet
          </Title>
          <Link href="/games">
            <Center mt={20}>
              <Button>Add a game</Button>
            </Center>
          </Link>
        </>
      )}
      {!isSelfUser && !otherHasGames && (
        <>
          <Title align="center" size={isMobile ? 24 : 32}>
            This user has no games added yet
          </Title>
        </>
      )}
      {gameEntryModalData && (
        <GameEntryEditModal
          opened={isOpen}
          gameEntry={gameEntryModalData}
          onClose={handleClose}
          isAddingGame={false}
        />
      )}
    </Box>
  );
};

interface GameSectionProps {
  isSelfUser: boolean;
  user: User;
  games: Record<GameEntryStatus, GameEntry[]>;
  handleEdit: (_: GameEntry) => void;
}

const ListGameSections = ({
  isSelfUser,
  user,
  games,
  handleEdit,
}: GameSectionProps) => {
  return (
    <>
      {GAME_SECTION_ORDER.map((section) => {
        if (games[section].length === 0) {
          return;
        }
        return (
          <>
            <Title
              align="center"
              mt={section === GAME_SECTION_ORDER[0] ? 0 : 70}
            >
              {gameEntryStatusToString(section)}
            </Title>
            {games[section].map((value) => {
              const { game_id } = value;

              return (
                <Box mt={12} key={game_id}>
                  <Link href={`/games/${game_id}`}>
                    <GameEntryCard
                      gameEntry={value}
                      onClickEdit={handleEdit}
                      isEditable={isSelfUser}
                      username={user.username}
                    />
                  </Link>
                </Box>
              );
            })}
          </>
        );
      })}
    </>
  );
};

const GridGameSections = ({
  isSelfUser,
  user,
  games,
  handleEdit,
}: GameSectionProps) => {
  const statusFilterform = useForm<{ statusFilter: string[] }>({
    initialValues: {
      statusFilter: LIST_OF_STATUSES.map((x) => gameEntryStatusToString(x)),
    },
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  return (
    <>
      <Group mb={15} mt={25}>
        <Chip.Group
          {...statusFilterform.getInputProps("statusFilter")}
          multiple
        >
          {GAME_SECTION_ORDER.map((status) => {
            return (
              <Chip
                value={gameEntryStatusToString(status)}
                key={status}
                color={STATUS_MANTINE_COLOR[status]}
              >
                {gameEntryStatusToString(status)}
              </Chip>
            );
          })}
        </Chip.Group>
        <Chip onChange={(v) => setShowOnlyFavorites(v)}>Favorites</Chip>
      </Group>

      <SimpleGrid
        cols={5}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "lg" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
        mt={10}
      >
        {GAME_SECTION_ORDER.map((section) => {
          const strSection = gameEntryStatusToString(section);
          if (!statusFilterform.values.statusFilter.includes(strSection)) {
            return;
          }
          return (
            <>
              {games[section].map((gameEntry) => {
                if (showOnlyFavorites && !gameEntry.is_favourite) {
                  return;
                }
                return (
                  <GridGameEntryCard
                    username={user.username}
                    gameEntry={gameEntry}
                    onClickEdit={handleEdit}
                    isEditable={isSelfUser}
                    key={gameEntry.id}
                  />
                );
              })}
            </>
          );
        })}
      </SimpleGrid>
    </>
  );
};
export default GameSection;
