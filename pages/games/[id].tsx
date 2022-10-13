import { handleApiRequestError } from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import {
  createGameEntryApi,
  deleteGameEntryApi,
  getGameEntryListApi,
  updateGameEntryApi,
} from "@api/game_entries_api";
import { Game, GameEntry, GameEntryStatus, User } from "@api/types";
import PageHeader from "@components/PageHeader";
import {
  Badge,
  Button,
  Center,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { showSuccessNotification } from "utils/notifications";

interface SidebarProps {
  game?: Game;
  gameEntry?: GameEntry;
  setGameEntry: React.Dispatch<React.SetStateAction<GameEntry | undefined>>;
  user?: User;
}
const useStyles = createStyles((theme) => ({
  box: {
    boxSizing: "border-box",
    backgroundColor: theme.colors.dark[4],
    display: "flex",
    position: "relative",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
}));

const GameDetailsSidebar = ({
  game,
  gameEntry,
  setGameEntry,
  user,
}: SidebarProps) => {
  const { classes } = useStyles();
  const [status, setStatus] = useState<string>(
    String(gameEntry?.status) || String(GameEntryStatus.WISHLIST)
  );
  const [rating, setRating] = useState<string>(
    String(gameEntry?.rating) || "0"
  );

  useEffect(() => {
    if (gameEntry) {
      setStatus(String(gameEntry.status));
      setRating(String(gameEntry.rating));
    }
  }, [gameEntry]);

  const submitGameEntry = () => {
    if (!user || !game) {
      return;
    }
    const newGameEntry: GameEntry = gameEntry
      ? {
          ...gameEntry,
          status: Number(status),
          rating: Number(rating),
        }
      : {
          id: 0,
          user_id: user.id,
          game_id: game.id,
          game_name: game.name,
          game_cover: game.cover,
          is_favourite: false,
          status: Number(status),
          rating: Number(rating),
        };
    if (!gameEntry) {
      createGameEntryApi(newGameEntry)
        .then((gameEntry) => {
          // TODO notifications
          setGameEntry(gameEntry);
          console.log("created");
          showSuccessNotification({
            title: "Game added to display case",
            message: `${gameEntry.game_name}`,
          });
        })
        .catch((error) => {
          // TODO error handling
          console.log(handleApiRequestError(error).errorType);
        });
    } else {
      updateGameEntryApi(newGameEntry)
        .then(() => {
          // TODO notifications
          setGameEntry(newGameEntry);
          console.log("updated");
          showSuccessNotification({
            title: "Entry updated",
            message: `${gameEntry.game_name}`,
          });
        })
        .catch((error) => {
          // TODO error handling
          console.log(handleApiRequestError(error).errorType);
        });
    }
  };

  const deleteGameEntry = () => {
    if (!gameEntry) {
      return;
    }
    deleteGameEntryApi(gameEntry.id)
      .then(() => {
        // TODO notifications
        setGameEntry(undefined);
        setStatus('')
        setRating('')
        console.log("deleted");
      })
      .catch((error) => {
        // TODO error handling
        console.log(handleApiRequestError(error).errorType);
      });
  };

  const handleDeleteClick = () => {
    openConfirmModal({
      title: 'Delete entry',
      children: (
        <Text size="sm">
          Are you sure you want to delete this entry?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteGameEntry()
    })
  }

  return (
    <div className={classes.box} style={{ minWidth: 250 }}>
      <PageHeader
        title={game?.name || "Loading"}
        description={
          game
            ? `Add ${game?.name} to your list or check out the game's details`
            : "Error occurred"
        }
      />
      <Stack>
        {game && <Image src={game?.cover} alt="Game Cover" radius="md" />}
        {user && (
          <>
            {gameEntry ? (
              <Text size="sm">Update this game in your display case!</Text>
            ) : (
              <Text size="sm">Add this game to your display case!</Text>
            )}
            <Divider my="sm" color="dark.5" />
            <Select
              label="Status"
              placeholder="Pick one"
              value={status}
              onChange={(value) => {
                setStatus(value || "");
              }}
              data={[
                { value: String(GameEntryStatus.WISHLIST), label: "Wishlist" },
                { value: String(GameEntryStatus.BACKLOG), label: "Backlog" },
                { value: String(GameEntryStatus.PLAYING), label: "Playing" },
                {
                  value: String(GameEntryStatus.COMPLETED),
                  label: "Completed",
                },
                { value: String(GameEntryStatus.DROPPED), label: "Dropped" },
              ]}
            />
            <Select
              label="Rating"
              placeholder="Out of 10"
              value={rating}
              onChange={(value) => {
                setRating(value || "0");
              }}
              data={Array(11)
                .fill(0)
                .map((_, index) => `${index}`)}
            />
            <Button onClick={submitGameEntry}>Update</Button>
            {gameEntry && (
              <Button onClick={handleDeleteClick} color="red">
                Delete
              </Button>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

const Games: NextPage = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { id } = router.query;
  const [game, setGame] = useState<Game>();
  const [gameEntry, setGameEntry] = useState<GameEntry>();
  const user = useAppSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setIsLoading(true);
    getGameByIdApi(Number(id))
      .then((game) => {
        setGame(game);
        if (user) {
          getGameEntryListApi({ user_id: user.id, game_id: game.id }).then(
            (gameEntryList) => {
              if (gameEntryList.length == 1) {
                setGameEntry(gameEntryList[0]);
              }
            }
          );
        }
      })
      .catch((error) => {
        // TODO error handling
        console.log(handleApiRequestError(error).errorType);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady]);

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={3} zIndex="1" />
      <Center>
        <Text size={35}>{game?.name}</Text>
      </Center>
      <Grid grow>
        <Grid.Col span={2}>
          <GameDetailsSidebar
            game={game}
            gameEntry={gameEntry}
            setGameEntry={setGameEntry}
            user={user}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <div className={classes.box}>
            <Stack>
              <Text>{game?.summary}</Text>
              <Divider my="sm" color="dark.5" />
              <Group>
                <Text>Genres: </Text>
                {game?.genres.map((value, i) => {
                  return <Badge key={i}>{value}</Badge>;
                })}
              </Group>
              <Group>
                <Text>Platforms: </Text>
                {game?.platforms.map((value, i) => {
                  return <Badge key={i}>{value}</Badge>;
                })}
              </Group>
            </Stack>
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Games;
