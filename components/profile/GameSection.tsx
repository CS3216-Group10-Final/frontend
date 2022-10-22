import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameEntryListApi } from "@api/game_entries_api";
import { GameEntry, User } from "@api/types";
import { ActionIcon, Box, Button, Center, Title, Tooltip } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getGameEntries,
  selectAllGameEntries,
} from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
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
  const selfGameEntries = useAppSelector((state) =>
    Object.values(selectAllGameEntries(state))
  );
  const [otherGameEntries, setOtherGameEntries] = useState<GameEntry[]>([]);

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
          setOtherGameEntries(entries);
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    }
  }, [dispatch, userId, isSelfUser]);

  return (
    <Box>
      <Title order={1} align="center" mb={24}>
        Games
      </Title>

      {isSelfUser && selfGameEntries.length > 0 && (
        <Link href="/games">
          <Tooltip label="Add games">
            <ActionIcon
              color="primary"
              variant="filled"
              component="a"
              mt="lg"
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

      {(isSelfUser ? selfGameEntries : otherGameEntries).map((value) => {
        const { game_id } = value;

        return (
          <Box mt={12} key={game_id}>
            <Link href={`/games/${game_id}`}>
              <GameEntryCard
                gameEntry={value}
                onClickEdit={handleEdit}
                isEditable={isSelfUser}
              />
            </Link>
          </Box>
        );
      })}
      {((isSelfUser && selfGameEntries.length === 0) ||
        (!isSelfUser && otherGameEntries.length === 0)) && (
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
