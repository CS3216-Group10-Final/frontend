import { Game } from "@api/types";
import { Card, createStyles, Text } from "@mantine/core";
import Link from "next/link";

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

  return (
    <Link href={"/games/" + game.id}>
      <Card p="lg" shadow="lg" className={classes.card} radius="md">
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
  );
};

export default GameCard;
