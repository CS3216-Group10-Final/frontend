import { Game, GameEntryStatus } from "@api/types";
import { ActionIcon, Card, createStyles, Text } from "@mantine/core";
import { useAppSelector } from "@redux/hooks";
import { selectGameEntryByGameId } from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import Link from "next/link";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { TbFileText } from "react-icons/tb";
import GameEntryEditModal from "./profile/GameEntryEditModal";

type Props = {
  game: Game;
};
const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef("image");
  return {
    card: {
      position: "relative",
      height: 280,
      cursor: "pointer",

      [`&:hover .${image}`]: {
        transform: "scale(1.03)",
      },
    },

    image: {
      ref: image,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      transition: "transform 500ms ease",
    },

    overlay: {
      position: "absolute",
      top: "20%",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
    },

    quickButton: {
      position: "absolute",
      top: 8,
      left: 8,
      zIndex: 10,
    },

    content: {
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      zIndex: 1,
    },
  };
});

const GameCard = ({ game }: Props) => {
  const { classes } = useStyles();
  const gameEntry = useAppSelector((state) =>
    selectGameEntryByGameId(state, game.id)
  );
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const selfUser = useAppSelector(selectUser);
  const newGameEntry = {
    id: 0,
    user_id: selfUser?.id ?? 0,
    game_id: game.id,
    game_name: game.name,
    game_cover: game.cover,
    review: "",
    is_favourite: false,
    status: GameEntryStatus.WISHLIST,
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  return (
    <div className={classes.card}>
      {!gameEntry && selfUser && (
        <ActionIcon
          className={classes.quickButton}
          variant="filled"
          color="red"
          size={30}
          onClick={() => setEditModalOpen(true)}
        >
          <BsPlus size={28} />
        </ActionIcon>
      )}
      {gameEntry && selfUser && (
        <ActionIcon
          className={classes.quickButton}
          variant="filled"
          color="green"
          size={30}
          onClick={() => setEditModalOpen(true)}
        >
          <TbFileText size={20} />
        </ActionIcon>
      )}
      <Link href={"/games/" + game.id}>
        <Card
          p="lg"
          shadow="lg"
          radius="md"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className={classes.image}
            style={{ backgroundImage: `url(${game.cover})` }}
          />
          <div className={classes.overlay} />

          <div className={classes.content}>
            <Text size="lg">{game.name}</Text>
          </div>
        </Card>
      </Link>
      <GameEntryEditModal
        opened={isEditModalOpen}
        gameEntry={gameEntry ?? newGameEntry}
        onClose={handleEditModalClose}
        isAddingGame={gameEntry === undefined}
      />
    </div>
  );
};

export default GameCard;
