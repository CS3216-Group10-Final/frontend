import { useMantineTheme, Stack, SegmentedControl } from "@mantine/core";
import { GameEntryStatus, Genre, Platform } from "@api/types";
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from "recharts";
import { toProperCase } from "utils/helpers";
import { useState } from "react";

type Props = {
  gameStatusDistribution: Record<GameEntryStatus, number>;
  // gameGenreDistribution: Record<Genre, number>;
  // platformDistribution: Record<Platform, number>;
  // releaseYearDistribution: Record<number, number>;
  // playYearDistribution: Record<number, number>;
};

enum ChartType {
  STATUS = "Status",
  GENRE = "Genre",
  PLATFORM = "Platform",
  RELEASE = "Release Date",
  PLAY_YEAR = "Play Year",
}

const ChartBarDistribution = (props: Props) => {
  const {
    gameStatusDistribution,
    // gameGenreDistribution,
    // platformDistribution,
    // releaseYearDistribution,
    // playYearDistribution,
  } = props;

  const [chartType, setChartType] = useState(ChartType.STATUS);

  const theme = useMantineTheme();

  const gameStatusData = Object.entries(gameStatusDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      // Object.entries automatically maps the key into a String type
      // to get the original enum, we have to type case it to number :(
      label: toProperCase(GameEntryStatus[Number(key)]),
      value,
    };
  });

  // const gameGenreData = Object.entries(gameGenreDistribution).map((entry) => {
  //   const [key, value] = entry;

  //   return {
  //     // Object.entries automatically maps the key into a String type
  //     // to get the original enum, we have to type case it to number :(
  //     label: Genre[Number(key)],
  //     value,
  //   };
  // });

  // const platformData = Object.entries(platformDistribution).map((entry) => {
  //   const [key, value] = entry;

  //   return {
  //     // Object.entries automatically maps the key into a String type
  //     // to get the original enum, we have to type case it to number :(
  //     label: Platform[Number(key)],
  //     value,
  //   };
  // });

  // const releaseYearData = Object.entries(releaseYearDistribution).map(
  //   (entry) => {
  //     const [key, value] = entry;

  //     return {
  //       label: key,
  //       value,
  //     };
  //   }
  // );

  // const playYearData = Object.entries(playYearDistribution).map((entry) => {
  //   const [key, value] = entry;

  //   return {
  //     label: key,
  //     value,
  //   };
  // });

  const segmentedControlData = (
    Object.keys(ChartType) as (keyof typeof ChartType)[]
  ).map((key) => {
    return { label: ChartType[key], value: ChartType[key] };
  });

  const handleChange = (_value: string) => {
    const value = _value as ChartType;

    setChartType(value);
  };

  return (
    <Stack align="center">
      <SegmentedControl
        value={chartType}
        onChange={handleChange}
        data={segmentedControlData}
      />
      <ResponsiveContainer height={256} width="80%">
        <BarChart data={gameStatusData}>
          <XAxis dataKey="label" stroke={theme.colors.dark[0]} />
          <YAxis stroke={theme.colors.dark[0]} />
          <Bar dataKey="value" fill={theme.fn.primaryColor()} maxBarSize={64} />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default ChartBarDistribution;
