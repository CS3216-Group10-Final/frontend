import { Title, Box, Tooltip, ActionIcon } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getGameEntries,
  selectAllGameEntries,
} from "@redux/slices/GameEntry_slice";
import { selectUserId } from "@redux/slices/User_slice";
import Link from "next/link";
import React, { useEffect } from "react";
import { TbPlus } from "react-icons/tb";
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
        const { game_id } = value;

        return (
          <Box mt={12} key={game_id}>
            <Link href={`/games/${game_id}`}>
              <GameEntryCard gameEntry={value} />
            </Link>
          </Box>
        );
      })}

      <Link href="/games">
        <Tooltip label="Add games">
          <ActionIcon
            color="primary"
            variant="filled"
            component="a"
            mt="lg"
            ml="auto"
            mr={8}
          >
            <TbPlus size={18} />
          </ActionIcon>
        </Tooltip>
      </Link>
    </Box>
  );
};

export default GameSection;
