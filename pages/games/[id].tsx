import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
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
  MultiSelect,
  Select,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  createGameEntry,
  deleteGameEntry,
  getGameEntries,
  selectGameEntryByGameId,
  updateGameEntry,
} from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { showSuccessNotification } from "utils/notifications";

interface SidebarProps {
  game?: Game;
  gameEntry?: GameEntry;
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

const GameDetailsSidebar = ({ game, gameEntry, user }: SidebarProps) => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();

  interface FormValues {
    status: string;
    rating: string;
    platforms: string[];
  }

  const form = useForm<FormValues>({
    initialValues: {
      status: String(gameEntry?.status) || String(GameEntryStatus.WISHLIST),
      rating: String(gameEntry?.rating) || "0",
      platforms: [],
    },

    validate: {
      status: (value) => (value ? null : "Status is required"),
    },
  });

  useEffect(() => {
    if (gameEntry) {
      form.setValues({
        status: String(gameEntry.status),
        rating: String(gameEntry.rating),
        platforms: gameEntry.platforms,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEntry]);

  const submitGameEntry = (values: FormValues) => {
    if (!user || !game) {
      return;
    }
    const newGameEntry: GameEntry = gameEntry
      ? {
          ...gameEntry,
          status: Number(values.status),
          rating: Number(values.rating),
          platforms: values.platforms,
        }
      : {
          id: 0,
          user_id: user.id,
          game_id: game.id,
          game_name: game.name,
          game_cover: game.cover,
          is_favourite: false,
          platforms: values.platforms,
          status: Number(values.status),
          rating: Number(values.rating),
        };
    if (!gameEntry) {
      dispatch(createGameEntry(newGameEntry))
        .unwrap()
        .then((gameEntry) => {
          console.log("created");
          showSuccessNotification({
            title: "Game added to display case",
            message: `${gameEntry.game_name}`,
          });
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    } else {
      dispatch(updateGameEntry(newGameEntry))
        .unwrap()
        .then(() => {
          console.log("updated");
          showSuccessNotification({
            title: "Entry updated",
            message: `${gameEntry.game_name}`,
          });
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
        });
    }
  };

  const deleteCurrentGameEntry = () => {
    if (!gameEntry) {
      return;
    }
    dispatch(deleteGameEntry(gameEntry.id))
      .unwrap()
      .then(() => {
        form.reset();
        console.log("deleted");
        showSuccessNotification({
          title: "Game deleted from display case",
          message: `${gameEntry.game_name}`,
        });
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
  };

  const handleDeleteClick = () => {
    openConfirmModal({
      title: "Delete entry",
      children: (
        <Text size="sm">Are you sure you want to delete this entry?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteCurrentGameEntry(),
    });
  };

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
            <form onSubmit={form.onSubmit(submitGameEntry)}>
              <Select
                label="Status"
                placeholder="Pick one"
                data={[
                  {
                    value: String(GameEntryStatus.WISHLIST),
                    label: "Wishlist",
                  },
                  { value: String(GameEntryStatus.BACKLOG), label: "Backlog" },
                  { value: String(GameEntryStatus.PLAYING), label: "Playing" },
                  {
                    value: String(GameEntryStatus.COMPLETED),
                    label: "Completed",
                  },
                  { value: String(GameEntryStatus.DROPPED), label: "Dropped" },
                ]}
                {...form.getInputProps("status")}
              />
              <Select
                label="Rating"
                placeholder="Out of 10"
                data={Array(11)
                  .fill(0)
                  .map((_, index) => `${index}`)}
                {...form.getInputProps("rating")}
              />
              <MultiSelect
                label="Platform"
                placeholder="Pick any"
                data={game?.platforms || []}
                {...form.getInputProps("platforms")}
              />
              <Space h="md" />
              <Button type="submit" fullWidth>
                {gameEntry ? "Add" : "Update"}
              </Button>
            </form>
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
  const gameEntry = useAppSelector((state) =>
    selectGameEntryByGameId(state, game?.id ?? -1)
  );
  const user = useAppSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setIsLoading(true);
    getGameByIdApi(Number(id))
      .then((game) => {
        setGame(game);
        if (user) {
          dispatch(getGameEntries({ user_id: user.id, game_id: game.id }));
        }
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={3} zIndex="1" />
      <Link href="/games">
        <Button
          variant="subtle"
          leftIcon={<AiOutlineLeft size={14} style={{ marginTop: 2 }} />}
          style={{ fontSize: 16 }}
          pb={1}
        >
          Back
        </Button>
      </Link>
      <Center>
        <Title size={35} mb={8}>
          {game?.name}
        </Title>
      </Center>
      <Grid grow>
        <Grid.Col span={2}>
          <GameDetailsSidebar game={game} gameEntry={gameEntry} user={user} />
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
