import { useMantineTheme, Stack, SegmentedControl, Card } from "@mantine/core";
import { GameEntryStatus, Genre, Platform } from "@api/types";
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Cell,
  Pie,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { toProperCase } from "utils/helpers";
import { useState } from "react";
import { useMobile } from "utils/useMobile";

const customLabel = (
  props: PieLabelRenderProps,
  fontFamily: string | undefined
) => {
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const innerRadius = Number(props.innerRadius);
  const midAngle = Number(props.midAngle);
  const outerRadius = Number(props.outerRadius);
  const percent = Number(props.percent);

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.15 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontFamily={fontFamily}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

type Props = {
  gameStatusDistribution: Partial<Record<GameEntryStatus, number>>;
  gameGenreDistribution: Partial<Record<Genre, number>>;
  platformDistribution: Partial<Record<Platform, number>>;
  releaseYearDistribution: Record<number, number>;
  playYearDistribution: Record<number, number>;
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
    gameGenreDistribution,
    platformDistribution,
    releaseYearDistribution,
    playYearDistribution,
  } = props;

  const [chartType, setChartType] = useState(ChartType.STATUS);

  const theme = useMantineTheme();
  const isMobile = useMobile();

  // can change???
  const COLORS = [
    theme.colors.yellow[6],
    theme.colors.orange[6],
    theme.colors.green[6],
    theme.colors.cyan[6],
    theme.colors.indigo[6],
  ];

  const gameStatusData = Object.entries(gameStatusDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      // Object.entries automatically maps the key into a String type
      // to get the original enum, we have to type case it to number :(
      label: toProperCase(GameEntryStatus[Number(key)]),
      value,
    };
  });

  const gameGenreData = Object.entries(gameGenreDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const platformData = Object.entries(platformDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const releaseYearData = Object.entries(releaseYearDistribution).map(
    (entry) => {
      const [key, value] = entry;

      return {
        label: key,
        value,
      };
    }
  );

  const playYearData = Object.entries(playYearDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  const chartData = {
    [ChartType.STATUS]: gameStatusData,
    [ChartType.GENRE]: gameGenreData,
    [ChartType.PLATFORM]: platformData,
    [ChartType.RELEASE]: releaseYearData,
    [ChartType.PLAY_YEAR]: playYearData,
  };

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
    <Card radius="lg" shadow="sm" p="xl">
      <Stack align="center" sx={{ width: "100%" }}>
        <SegmentedControl
          value={chartType}
          onChange={handleChange}
          data={segmentedControlData}
          size={isMobile ? "xs" : "sm"}
        />
        <ResponsiveContainer height={256} width={isMobile ? "100%" : "80%"}>
          <PieChart width={256} height={256}>
            {isMobile || <Tooltip />}
            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Pie
              data={chartData[chartType]}
              label={(props) => customLabel(props, theme.fontFamily)}
              labelLine={false}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData[chartType].map((entry, index) => {
                return (
                  <Cell
                    name={
                      isMobile ? `${entry.label} - ${entry.value}` : entry.label
                    }
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                );
              })}
            </Pie>
          </PieChart>
          {/* <BarChart
          data={chartData[chartType]}
          margin={isMobile ? { left: -30, right: 10 } : {}}
        >
          <XAxis
            dataKey="label"
            stroke={theme.colors.dark[0]}
            fontSize={isMobile ? "0.7rem" : "1rem"}
            fontFamily={theme.fontFamily}
          />
          <YAxis
            allowDecimals={false}
            stroke={theme.colors.dark[0]}
            fontFamily={theme.fontFamily}
          />
          <Tooltip
            cursor={{ fill: theme.fn.rgba(theme.colors.dark[0], 0.5) }}
          />
          <Bar
            name="count"
            dataKey="value"
            fill={theme.fn.primaryColor()}
            maxBarSize={64}
          />
        </BarChart> */}
        </ResponsiveContainer>
      </Stack>
    </Card>
  );
};

export default ChartBarDistribution;
