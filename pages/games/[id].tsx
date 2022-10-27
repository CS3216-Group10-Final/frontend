import { getPathForGameWithId } from "@api/endpoint_paths";
import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { getGameByIdApi } from "@api/games_api";
import { getReviewsApi } from "@api/reviews_api";
import { Game, GameEntry, GameEntryStatus, ReviewEntry } from "@api/types";
import PageHeader from "@components/PageHeader";
import GameEntryEditModal from "@components/profile/GameEntryEditModal";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Blockquote,
  Button,
  Card,
  Center,
  Chip,
  createStyles,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Spoiler,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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
import {
  gameEntryStatusToString,
  GAME_SECTION_ORDER,
  LIST_OF_STATUSES,
  statusOrderComparator,
  STATUS_MANTINE_COLOR,
} from "utils/status";

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
  title,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = useAppSelector(selectUser);
  const [game, setGame] = useState<Game>();

  const gameEntry = useAppSelector((state) =>
    selectGameEntryByGameId(state, game?.id ?? -1)
  );
  const [friendReviewEntries, setFriendReviewEntries] = useState<ReviewEntry[]>(
    []
  );
  const [friendRatings, setFriendRatings] = useState<ReviewEntry[]>([]);

  const [gameEntryModalData, setGameEntryModalData] = useState<
    GameEntry | undefined
  >(undefined);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { classes } = useStyles();

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

    const gamePromise = getGameByIdApi(Number(id))
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

    const reviewPromise = getReviewsApi({
      game_id: Number(id),
      following_only: true,
      page: 1,
      has_review: true,
    })
      .then((reviews) => {
        setFriendReviewEntries(reviews);
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });

    const ratingPromise = getReviewsApi({
      game_id: Number(id),
      following_only: true,
      page: 1,
      has_rating: true,
    })
      .then((reviews) => {
        setFriendRatings(
          reviews.sort((a, b) => statusOrderComparator(a.status, b.status))
        );
      })
      .catch((error) => {
        showApiRequestErrorNotification(handleApiRequestError(error));
      });
    Promise.all([gamePromise, reviewPromise, ratingPromise]).finally(() => {
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
      <PageHeader title={title} description="View this game on DisplayCase" />
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
      {user && friendRatings.length == 0 && friendReviewEntries.length == 0 && (
        <div className={classes.box} style={{ flexDirection: "column" }}>
          <Text align="center">
            You are not following anyone who has played this game.
          </Text>
        </div>
      )}
      {user && friendRatings.length > 0 && (
        <RatingSection friendRatings={friendRatings} />
      )}
      {user && friendReviewEntries?.length > 0 && (
        <div className={classes.box} style={{ flexDirection: "column" }}>
          <Title size={25} mb={8}>
            Reviews
          </Title>
          {friendReviewEntries.map((reviewEntry) => {
            return (
              <Blockquote
                cite={`- ${reviewEntry.user_username}${
                  reviewEntry.rating === null ||
                  reviewEntry.rating === undefined
                    ? ""
                    : `, who gave this game ${reviewEntry.rating}/10`
                }`}
                key={reviewEntry.user_username}
              >
                <Spoiler maxHeight={250} showLabel="Show more" hideLabel="Hide">
                  {reviewEntry.review}
                </Spoiler>
              </Blockquote>
            );
          })}
        </div>
      )}
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

interface RatingProps {
  friendRatings: ReviewEntry[];
}

const RatingSection = ({ friendRatings }: RatingProps) => {
  const theme = useMantineTheme();
  const badgeColor = {
    [GameEntryStatus.DROPPED]: theme.colors.red[5],
    [GameEntryStatus.COMPLETED]: theme.colors.green[5],
    [GameEntryStatus.PLAYING]: theme.colors.yellow[5],
    [GameEntryStatus.BACKLOG]: theme.colors.blue[5],
    [GameEntryStatus.WISHLIST]: theme.colors.dark[3],
  };
  const { classes } = useStyles();

  const statusFilterform = useForm<{ statusFilter: string[] }>({
    initialValues: {
      statusFilter: LIST_OF_STATUSES.map((x) => gameEntryStatusToString(x)),
    },
  });
  return (
    <div className={classes.box} style={{ flexDirection: "column" }}>
      <Group>
        <Title size={25} mb={8}>
          Ratings
        </Title>
        <Chip.Group
          {...statusFilterform.getInputProps("statusFilter")}
          mb={5}
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
      </Group>
      <Group>
        {friendRatings.map((reviewEntry) => {
          if (
            !statusFilterform.values.statusFilter.includes(
              gameEntryStatusToString(reviewEntry.status)
            )
          ) {
            return;
          }
          return (
            <Card
              key={reviewEntry.user_username}
              style={{
                borderLeft: "5px solid",
                borderColor: badgeColor[reviewEntry.status],
              }}
            >
              <Group>
                <Link href={`/user/${reviewEntry.user_username}`}>
                  <Avatar
                    src={reviewEntry.user_picture}
                    size={35}
                    radius={5}
                    style={{ cursor: "pointer" }}
                  />
                </Link>
                <Link href={`/user/${reviewEntry.user_username}`} passHref>
                  <Anchor component="a" style={{ color: "white" }}>
                    {reviewEntry.user_username}
                  </Anchor>
                </Link>
                <Text>{reviewEntry.rating}/10</Text>
              </Group>
            </Card>
          );
        })}
      </Group>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;
  try {
    const gameResponse = await fetch(
      process.env.NEXT_PUBLIC_BE_ENDPOINT + getPathForGameWithId(Number(id))
    );
    const game: Game = await gameResponse.json();
    return {
      props: {
        id: id as string,
        title: game.name ?? "Game",
      },
    };
  } catch {
    return {
      props: {
        id: id as string,
        title: "Game",
      },
    };
  }
};
export default Games;
