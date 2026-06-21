import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { getDayOfYear } from "date-fns/getDayOfYear";
import { parseISO } from "date-fns/parseISO";
import useChartTheme from "./useChartTheme";
import { useEffect, useState } from "react";
import { formatDuration } from "./format";

export type DurationAccumulationChartData = {
  readonly thisYear: readonly {
    readonly date: string;
    readonly durationSeconds: number;
  }[];
  readonly lastYear: readonly {
    readonly date: string;
    readonly durationSeconds: number;
  }[];
};

export default function DurationAccumulationChart({
  data,
}: {
  data: DurationAccumulationChartData;
}) {
  const {
    fontFamily,
    colorLastYear,
    colorThisYear,
    fontSmall,
    fontBase,
    baseColor,
    tooltipBackground,
  } = useChartTheme();

  // Only mount on the server as the chart is dependent on the theme which cannot be known on the server
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const thisYear = accumulateDays(data.thisYear);
  const lastYear = accumulateDays(data.lastYear);

  return (
    <VictoryChart
      padding={{ left: 60, bottom: 30, right: 20, top: 30 }}
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
    >
      <VictoryLabel
        text="Accumulated training time"
        x={230}
        y={10}
        textAnchor="middle"
        style={{ fill: baseColor, fontSize: fontBase, fontFamily }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(y) => formatDuration(y)}
        style={{
          tickLabels: {
            fontFamily,
            fontSize: fontBase,
            fill: baseColor,
          },
          ticks: { stroke: baseColor, size: 5 },
          axis: { stroke: baseColor },
        }}
      />
      <VictoryAxis
        tickFormat={(x) => dayOfYearToMonth(x)}
        tickValues={middleOfEachMonth()}
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
          x="dayOfYear"
          y="durationSeconds"
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
          x="dayOfYear"
          y="durationSeconds"
        />
      </VictoryGroup>
    </VictoryChart>
  );
}

function accumulateDays(
  data: readonly { readonly date: string; readonly durationSeconds: number }[],
) {
  return data.reduce<{ dayOfYear: number; durationSeconds: number }[]>(
    (acc, cur) => {
      const durationSeconds =
        acc.length > 0
          ? acc[acc.length - 1].durationSeconds + cur.durationSeconds
          : cur.durationSeconds;
      acc.push({
        dayOfYear: getDayOfYear(parseISO(cur.date)),
        durationSeconds,
      });
      return acc;
    },
    [],
  );
}

function middleOfEachMonth() {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) => {
    return getDayOfYear(new Date(year, i, 15));
  });
}

function dayOfYearToMonth(dayOfYear: number) {
  const date = new Date();
  date.setMonth(0);
  date.setDate(dayOfYear);
  return date.toLocaleString("default", { month: "short" });
}
