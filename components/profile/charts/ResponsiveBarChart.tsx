import React from "react";
import { useMantineTheme } from "@mantine/core";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";
import { useMobile } from "utils/useMobile";

type Props = {
  data: Array<{
    label: string;
    value: number | undefined;
  }>;
};

const ResponsiveBarChart = (props: Props) => {
  const { data } = props;

  const theme = useMantineTheme();
  const isMobile = useMobile();

  const maxLength = 13;

  const truncatedData = data.map((element) => {
    const { label } = element;

    const newLabel =
      label.length > maxLength
        ? label.substring(0, maxLength).concat("...")
        : label;

    return {
      ...element,
      label: newLabel,
    };
  });

  if (isMobile) {
    return (
      <ResponsiveContainer width="99%" height={50 * truncatedData.length}>
        <BarChart data={truncatedData} layout="vertical" margin={{ left: 20 }}>
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: theme.fontSizes.xs, fill: theme.colors.dark[0] }}
          />
          <YAxis
            type="category"
            dataKey="label"
            interval={0}
            tick={{ fontSize: theme.fontSizes.xs, fill: theme.colors.dark[0] }}
          />
          <Bar dataKey="value" barSize={20} fill={theme.fn.primaryColor()} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="99%" height={256}>
      <BarChart data={truncatedData} margin={{ left: 20 }}>
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

export default ResponsiveBarChart;
