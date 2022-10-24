import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameEntryListApi } from "@api/game_entries_api";
import { GameEntry, GameEntryStatus, User } from "@api/types";
import { ActionIcon, Box, Button, Center, Title, Tooltip } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getAllGameEntriesFiltered,
  getGameEntries,
  selectAllGameEntriesFiltered,
  selectSelfHasGames,
} from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { gameEntryStatusToString } from "utils/status";
import GameEntryCard from "./GameEntryCard";
import GameEntryEditModal from "./GameEntryEditModal";

const GAME_SECTION_ORDER = [
  GameEntryStatus.PLAYING,
  GameEntryStatus.COMPLETED,
  GameEntryStatus.BACKLOG,
  GameEntryStatus.DROPPED,
  GameEntryStatus.WISHLIST,
];

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
      {isSelfUser && selfHasGames && (
        <Link href="/games">
          <Tooltip label="Add games">
            <ActionIcon
              color="primary"
              variant="filled"
              component="a"
              ml="auto"
              mr={8}
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

      {((isSelfUser && selfHasGames) || (!isSelfUser && otherHasGames)) &&
        GAME_SECTION_ORDER.map((section) => {
          if (
            (isSelfUser ? selfFilteredGames : otherFilteredGames)[section]
              .length === 0
          ) {
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
              {(isSelfUser ? selfFilteredGames : otherFilteredGames)[
                section
              ].map((value) => {
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

      {((isSelfUser && !selfHasGames) || (!isSelfUser && !otherHasGames)) && (
        <>
          <Title align="center" size={22}>
            You have no games added yet
          </Title>
          <Link href="/games">
            <Center mt={20}>
              <Button>Add a game</Button>
            </Center>
          </Link>
        </>
      )}
      {gameEntryModalData && (
        <GameEntryEditModal
          opened={isOpen}
          gameEntry={gameEntryModalData}
          onClose={handleClose}
        />
      )}
    </Box>
  );
};

export default GameSection;
