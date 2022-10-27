import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import { Game, GameEntry, GameEntryStatus } from "@api/types";
import PageHeader from "@components/PageHeader";
import GameEntryEditModal from "@components/profile/GameEntryEditModal";
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  createStyles,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getGameEntries,
  selectGameEntryByGameId,
} from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { TbFileText } from "react-icons/tb";

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
  quickButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    borderRadius: 10,
    padding: 20,
    marginRight: 8,
    height: 400,
  },
}));

const Games = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { classes } = useStyles();
  const [game, setGame] = useState<Game>();
  const gameEntry = useAppSelector((state) =>
    selectGameEntryByGameId(state, game?.id ?? -1)
  );
  const [gameEntryModalData, setGameEntryModalData] = useState<
    GameEntry | undefined
  >(undefined);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const newGameEntry = {
    id: 0,
    user_id: user?.id ?? 0,
    game_id: game?.id ?? 0,
    game_name: game?.name ?? "",
    game_cover: game?.cover ?? "",
    review: "",
    is_favourite: false,
    status: GameEntryStatus.WISHLIST,
  };

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

  const handleEditModalOpen = () => {
    if (gameEntry === undefined) {
      setGameEntryModalData(newGameEntry);
    } else {
      setGameEntryModalData(gameEntry);
    }
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title={game?.name ?? "Game"}
        description="View this game on DisplayCase"
      />
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
      <div className={classes.box}>
        <Grid grow>
          <Grid.Col sm={2} style={{ position: "relative", height: 400 }}>
            {game && (
              <div
                className={classes.image}
                style={{ backgroundImage: `url(${game.cover})` }}
              >
                {!gameEntry && user && (
                  <ActionIcon
                    className={classes.quickButton}
                    variant="filled"
                    color="red"
                    size={40}
                    onClick={handleEditModalOpen}
                  >
                    <BsPlus size={38} />
                  </ActionIcon>
                )}
                {gameEntry && user && (
                  <ActionIcon
                    className={classes.quickButton}
                    variant="filled"
                    color="green"
                    size={40}
                    onClick={handleEditModalOpen}
                  >
                    <TbFileText size={30} />
                  </ActionIcon>
                )}
              </div>
            )}
          </Grid.Col>
          <Grid.Col sm={6} style={{ position: "relative" }}>
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
          </Grid.Col>
        </Grid>
      </div>
      {gameEntryModalData && (
        <GameEntryEditModal
          opened={isEditModalOpen}
          onClose={handleEditModalClose}
          gameEntry={gameEntryModalData}
          isAddingGame={gameEntry === undefined}
        />
      )}
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  return {
    props: {
      id: id as string,
    },
  };
};
export default Games;
