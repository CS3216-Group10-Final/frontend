import { Title, Box } from "@mantine/core";
import { useAppSelector } from "@redux/hooks";
import { selectAllGameEntries } from "@redux/slices/GameEntry_slice";
import Link from "next/link";
import React from "react";
import GameEntryCard from "./GameEntryCard";

const GameSection = () => {
  const gameEntries = useAppSelector((state) =>
    Object.values(selectAllGameEntries(state))
  );

  return (
    <Box>
      <Title order={1} align="center" mb={24}>
        Games
      </Title>
      {gameEntries.map((value) => {
        const { game_id, game_name, game_cover } = value;

        return (
          <Box mt={12} key={game_id}>
            <Link href={`/games/${game_id}`}>
              <GameEntryCard title={game_name} cover={game_cover} />
            </Link>
          </Box>
        );
      })}
    </Box>
  );
};

export default GameSection;
