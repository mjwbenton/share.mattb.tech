import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import useChartTheme from "./useChartTheme";
import { useEffect, useState } from "react";
import { formatDuration } from "./format";

type MonthData = readonly {
  readonly month: number;
  readonly spm: number | undefined;
}[];

export type SwimSpeedChartData = {
  readonly thisYear: MonthData;
  readonly lastYear: MonthData;
};

export default function SwimSpeedChart({ data }: { data: SwimSpeedChartData }) {
  const {
    fontFamily,
    colorThisYear,
    colorLastYear,
    fontSmall,
    fontBase,
    tooltipBackground,
    baseColor,
  } = useChartTheme();

  // Only mount on the server as the chart is dependent on the theme which cannot be known on the server
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const thisYear = data.thisYear.filter((d) => d.spm != null);
  const lastYear = data.lastYear.filter((d) => d.spm != null);

  return (
    <VictoryChart
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) => `${formatDuration(datum.spm * 100)} per 100m`}
          labelComponent={
            <VictoryTooltip
              cornerRadius={0}
              flyoutStyle={{ stroke: "none", fill: tooltipBackground }}
              pointerWidth={0}
            />
          }
          mouseFollowTooltips
        />
      }
      domainPadding={10}
      padding={{ left: 60, bottom: 30, right: 20, top: 30 }}
    >
      <VictoryLabel
        text="Average time to swim 100m by month"
        x={230}
        y={10}
        textAnchor="middle"
        style={{ fill: baseColor, fontSize: fontBase, fontFamily }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(t) => formatDuration(t * 100)}
        style={{
          tickLabels: {
            fontFamily: fontFamily,
            fontSize: fontBase,
            fill: baseColor,
          },
          ticks: { stroke: baseColor, size: 5 },
          axis: { stroke: baseColor },
        }}
      />
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        tickFormat={(m) => monthName(m)}
        style={{
          tickLabels: {
            fontFamily: fontFamily,
            fontSize: fontSmall,
            fill: baseColor,
          },
          axis: { stroke: baseColor },
        }}
      />
      <VictoryGroup>
        <VictoryLine
          style={{
            data: { stroke: colorLastYear, strokeWidth: 1 },
            labels: {
              fill: colorLastYear,
              fontFamily: fontFamily,
              fontSize: fontSmall,
            },
          }}
          data={lastYear}
          x="month"
          y="spm"
        />
        <VictoryLine
          style={{
            data: {
              stroke: colorThisYear,
              strokeWidth: 2,
            },
            labels: {
              fill: colorThisYear,
              fontFamily: fontFamily,
              fontSize: fontSmall,
            },
          }}
          data={thisYear}
          x="month"
          y="spm"
        />
      </VictoryGroup>
    </VictoryChart>
  );
}

function monthName(month: number) {
  return new Date(2000, month - 1).toLocaleString("default", {
    month: "short",
  });
}
