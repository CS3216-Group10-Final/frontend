import { Genre } from "@api/types";
import { useMantineTheme } from "@mantine/core";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMobile } from "utils/useMobile";

type Props = {
  gameGenreDistribution: Partial<Record<Genre, number>>;
};

const GenreChart = (props: Props) => {
  const { gameGenreDistribution } = props;

  const isMobile = useMobile();
  const theme = useMantineTheme();
  const maximumStringLength = isMobile ? 13 : 20;

  const gameGenreData = Object.entries(gameGenreDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label:
        key.length > maximumStringLength
          ? key.substring(0, 10).concat("...")
          : key,
      value,
    };
  });

  return (
    <ResponsiveContainer width="99%" height={256}>
      <BarChart data={gameGenreData} margin={{ left: 20 }}>
        <XAxis
          allowDecimals={false}
          dataKey="label"
          tick={{ fontSize: theme.fontSizes.xs, fill: theme.colors.dark[0] }}
          interval={0}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: theme.fontSizes.xs, fill: theme.colors.dark[0] }}
        />
        <Bar dataKey="value" barSize={30} fill={theme.fn.primaryColor()} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GenreChart;
