import React from "react";
import ResponsiveBarChart from "./ResponsiveBarChart";

type Props = {
  releaseYearDistribution: Record<number, number>;
};

const ReleaseYearChart = (props: Props) => {
  const { releaseYearDistribution } = props;

  const releaseYearData = Object.entries(releaseYearDistribution).map(
    (entry) => {
      const [key, value] = entry;

      return {
        label: key,
        value,
      };
    }
  );

  return <ResponsiveBarChart data={releaseYearData} />;
};

export default ReleaseYearChart;
