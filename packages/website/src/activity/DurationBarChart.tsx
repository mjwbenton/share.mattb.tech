import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import useChartTheme from "./useChartTheme";
import { useEffect, useState } from "react";
import { formatDuration } from "./format";

export type DurationBarChartData = {
  readonly thisYear: readonly {
    readonly month: number;
    readonly durationSeconds: number;
  }[];
  readonly lastYear: readonly {
    readonly month: number;
    readonly durationSeconds: number;
  }[];
};

export default function DurationBarChart({
  data,
}: {
  data: DurationBarChartData;
}) {
  const {
    fontFamily,
    colorLastYear,
    colorThisYear,
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

  return (
    <VictoryChart
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) => formatDuration(datum.durationSeconds)}
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
        text="Training time by month"
        x={230}
        y={10}
        textAnchor="middle"
        style={{ fill: baseColor, fontSize: fontBase, fontFamily }}
      />
      <VictoryAxis
        dependentAxis
        tickValues={hourTicks(
          Math.max(
            ...data.thisYear.map((d) => d.durationSeconds),
            ...data.lastYear.map((d) => d.durationSeconds),
          ),
        )}
        tickFormat={(y) => formatDuration(y)}
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
        tickCount={12}
        tickFormat={(x) => monthNumberToName(x)}
        style={{
          tickLabels: {
            fontFamily: fontFamily,
            fontSize: fontSmall,
            fill: baseColor,
          },
          axis: { stroke: baseColor },
        }}
      />
      <VictoryGroup offset={-5}>
        <VictoryBar
          style={{
            data: { fill: colorLastYear, width: 10 },
            labels: {
              fill: colorLastYear,
              fontFamily: fontFamily,
              fontSize: fontSmall,
            },
          }}
          data={data.lastYear}
          x="month"
          y="durationSeconds"
        />
        <VictoryBar
          style={{
            data: {
              fill: colorThisYear,
              width: 10,
              strokeWidth: 0.5,
              stroke: baseColor,
            },
            labels: {
              fill: colorThisYear,
              fontFamily: fontFamily,
              fontSize: fontSmall,
            },
          }}
          data={data.thisYear}
          x="month"
          y="durationSeconds"
        />
      </VictoryGroup>
    </VictoryChart>
  );
}

function hourTicks(maxSeconds: number): number[] {
  const maxHours = Math.ceil(maxSeconds / 3600);
  const step = Math.ceil(maxHours / 6);
  return Array.from(
    { length: Math.floor(maxHours / step) },
    (_, i) => (i + 1) * step * 3600,
  );
}

function monthNumberToName(month: number) {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleString("default", { month: "short" });
}
