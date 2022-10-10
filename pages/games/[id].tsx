import { handleApiRequestError } from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import {
  createGameEntryApi,
  getGameEntryListApi,
  updateGameEntryApi,
} from "@api/game_entries_api";
import { Game, GameEntry, GameEntryStatus, User } from "@api/types";
import {
  Badge,
  Button,
  Center,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useAppSelector } from "@redux/hooks";
import { selectUser } from "@redux/slices/User_slice";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [status, setStatus] = useState<string>(
    String(gameEntry?.status) || String(GameEntryStatus.WISHLIST)
  );
  const [rating, setRating] = useState<string>(
    String(gameEntry?.rating) || "0"
  );

  const submitGameEntry = () => {
    if (!user || !game) {
      return;
    }
    const newGameEntry: GameEntry = {
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
        .then(() => {
          // TODO notifications
          console.log("created");
        })
        .catch((error) => {
          // TODO error handling
          console.log(handleApiRequestError(error).errorType);
        });
    } else {
      updateGameEntryApi(newGameEntry)
        .then(() => {
          // TODO notifications
          console.log("updated");
        })
        .catch((error) => {
          // TODO error handling
          console.log(handleApiRequestError(error).errorType);
        });
    }
  };

  return (
    <div className={classes.box} style={{ minWidth: 250 }}>
      <Stack>
        <Image src={game?.cover} alt="Game Cover" radius="md" />
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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
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
      });
  }, [router.isReady]);

  return (
    <>
      <Center>
        <Text size={35}>{game?.name}</Text>
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
