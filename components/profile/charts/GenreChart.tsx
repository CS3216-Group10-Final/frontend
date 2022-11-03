import { Genre } from "@api/types";
import { useMantineTheme } from "@mantine/core";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMobile } from "utils/useMobile";
import ResponsiveBarChart from "./ResponsiveBarChart";

type Props = {
  gameGenreDistribution: Partial<Record<Genre, number>>;
};

const GenreChart = (props: Props) => {
  const { gameGenreDistribution } = props;

  const gameGenreData = Object.entries(gameGenreDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  return <ResponsiveBarChart data={gameGenreData} />;
};

export default GenreChart;
