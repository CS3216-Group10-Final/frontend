import { Title, Box } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getGameEntries,
  selectAllGameEntries,
} from "@redux/slices/GameEntry_slice";
import { selectUserId } from "@redux/slices/User_slice";
import Link from "next/link";
import React, { useEffect } from "react";
import GameEntryCard from "./GameEntryCard";

const GameSection = () => {
  const userId = useAppSelector(selectUserId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGameEntries({ user_id: userId }));
  }, [dispatch, userId]);

  const gameEntries = useAppSelector((state) =>
    Object.values(selectAllGameEntries(state))
  );

  return (
    <Box>
      <Title order={1} align="center" mb={24}>
        Games
      </Title>
      {gameEntries.map((value) => {
        const { game_id, game_name, game_cover, rating } = value;

        return (
          <Box mt={12} key={game_id}>
            <Link href={`/games/${game_id}`}>
              <GameEntryCard
                title={game_name}
                cover={game_cover}
                rating={rating}
              />
            </Link>
          </Box>
        );
      })}
    </Box>
  );
};

export default GameSection;
