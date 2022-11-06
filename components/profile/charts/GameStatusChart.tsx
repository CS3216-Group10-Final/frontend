import React, { useState } from "react";
import { toProperCase } from "utils/helpers";
import { GameEntryStatus } from "@api/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { MantineTheme, useMantineTheme } from "@mantine/core";
import { useStatusColor } from "utils/status";

type Props = {
  gameStatusDistribution: Partial<Record<GameEntryStatus, number>>;
};

// Below is from: https://recharts.org/en-US/examples/CustomActiveShapePieChart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any, theme: MantineTheme) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    label,
    value,
    fill,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight={700}
      >
        {label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={theme.white}
        fontFamily={theme.fontFamily}
      >{`${label}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fontFamily={theme.fontFamily}
        fill="#999"
      >
        {`(${value} games)`}
      </text>
    </g>
  );
};

const GameStatusChart = (props: Props) => {
  const { gameStatusDistribution } = props;

  const theme = useMantineTheme();

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const statusColor = useStatusColor();

  const gameStatusData = Object.entries(gameStatusDistribution).map((entry) => {
    const [key, value] = entry;

    console.log(Number(key));

    return {
      // Object.entries automatically maps the key into a String type
      // to get the original enum, we have to type case it to number :(
      label: toProperCase(GameEntryStatus[Number(key)]),
      color: statusColor[Number(key) as keyof typeof statusColor],
      value,
    };
  });

  return (
    <ResponsiveContainer width="99%" height={256}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={(props) => renderActiveShape(props, theme)}
          data={gameStatusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {gameStatusData.map((element) => {
            const { label, value, color } = element;

            return <Cell key={`${label}-${value}`} fill={color} />;
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GameStatusChart;
