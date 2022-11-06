import { Game, GameEntry, GameEntryStatus } from "@api/types";
import {
  ActionIcon,
  Card,
  createStyles,
  MantineNumberSize,
  Text,
} from "@mantine/core";
import { useAppSelector } from "@redux/hooks";
import { selectGameEntryByGameId } from "@redux/slices/GameEntry_slice";
import { selectUser } from "@redux/slices/User_slice";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { TbFileText } from "react-icons/tb";
import GameEntryEditModal from "./profile/GameEntryEditModal";

type Props = {
  game: Game;
  height?: number;
  hideTitle?: boolean;
  titleSize?: number | MantineNumberSize;
  overrideOnClick?: () => void;
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

const GameCard = ({
  game,
  height,
  hideTitle,
  overrideOnClick,
  titleSize,
}: Props) => {
  const { classes } = useStyles();
  const gameEntry = useAppSelector((state) =>
    selectGameEntryByGameId(state, game.id)
  );
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [gameEntryModalData, setGameEntryModalData] = useState<
    GameEntry | undefined
  >(undefined);
  const selfUser = useAppSelector(selectUser);
  const router = useRouter();
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

  const handleEditModalOpen = (isAdding: boolean) => {
    if (isAdding) {
      setGameEntryModalData(newGameEntry);
    } else {
      setGameEntryModalData(gameEntry);
    }
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const goToGamePage = () => {
    router.push("/games/" + game.id);
  };

  return (
    <div className={classes.card} style={height ? { height: height } : {}}>
      {!gameEntry && selfUser && (
        <ActionIcon
          className={classes.quickButton}
          variant="filled"
          color="red"
          size={30}
          onClick={() => handleEditModalOpen(true)}
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
          onClick={() => handleEditModalOpen(false)}
        >
          <TbFileText size={20} />
        </ActionIcon>
      )}
      <Card
        p="lg"
        shadow="lg"
        radius="md"
        style={{ width: "100%", height: "100%" }}
        onClick={overrideOnClick ? overrideOnClick : goToGamePage}
      >
        <div
          className={classes.image}
          style={{ backgroundImage: `url(${game.cover})` }}
        />
        <div className={classes.overlay} />

        <div className={classes.content}>
          {!hideTitle && (
            <Text size={titleSize ? titleSize : "lg"}>{game.name}</Text>
          )}
        </div>
      </Card>
      {gameEntryModalData && (
        <GameEntryEditModal
          opened={isEditModalOpen}
          gameEntry={gameEntryModalData}
          onClose={handleEditModalClose}
          isAddingGame={gameEntry === undefined}
        />
      )}
    </div>
  );
};

export default GameCard;
