import React from "react";
import { Platform } from "@api/types";
import ResponsiveBarChart from "./ResponsiveBarChart";

type Props = {
  platformDistribution: Partial<Record<Platform, number>>;
};

const PlatformChart = (props: Props) => {
  const { platformDistribution } = props;

  const platformData = Object.entries(platformDistribution).map((entry) => {
    const [key, value] = entry;

    return {
      label: key,
      value,
    };
  });

  return <ResponsiveBarChart data={platformData} />;
};

export default PlatformChart;
