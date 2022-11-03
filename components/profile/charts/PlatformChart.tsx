import React from "react";
import { Platform } from "@api/types";
import { useMantineTheme } from "@mantine/core";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";
import { useMobile } from "utils/useMobile";

type Props = {
  platformDistribution: Partial<Record<Platform, number>>;
};

const PlatformChart = (props: Props) => {
  const { platformDistribution } = props;

  const theme = useMantineTheme();
  const isMobile = useMobile();
  const maximumStringLength = isMobile ? 13 : 20;

  const platformData = Object.entries(platformDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label:
        key.length > maximumStringLength
          ? key.substring(0, 10).concat("...")
          : key,
      value,
    };
  });

  console.log(platformData);

  return (
    <ResponsiveContainer width="99%" height={256}>
      <BarChart data={platformData} margin={{ left: 20 }}>
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

export default PlatformChart;
