import Tile from "component/Tile";
import { BodyScan } from "./types";
import { chartColors } from "./colours";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import useChartTheme from "activity/useChartTheme";
import { useEffect, useState } from "react";

interface CompositionHistoryProps {
  scans: BodyScan[];
}

export default function CompositionHistory({ scans }: CompositionHistoryProps) {
  const { fontFamily, fontBase, fontSmall, baseColor, tooltipBackground } =
    useChartTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || scans.length < 2) {
    return null;
  }

  const sortedScans = [...scans].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const weightData = sortedScans.map((s) => ({
    x: s.date,
    y: s.bodyComposition.weight,
  }));

  const smmData = sortedScans.map((s) => ({
    x: s.date,
    y: s.bodyComposition.skeletalMuscleMass,
  }));

  const pbfData = sortedScans.map((s) => ({
    x: s.date,
    y: s.obesityAnalysis.percentBodyFat,
  }));

  const colorWeight = chartColors.weight;
  const colorSMM = chartColors.smm;
  const colorPBF = chartColors.pbf;

  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Composition History</div>

        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${datum.y.toFixed(1)}`}
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
          padding={{ left: 50, bottom: 50, right: 30, top: 30 }}
          height={250}
        >
          <VictoryLegend
            x={50}
            y={0}
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fontSize: fontSmall, fill: baseColor, fontFamily },
            }}
            data={[
              { name: "Weight (kg)", symbol: { fill: colorWeight } },
              { name: "SMM (kg)", symbol: { fill: colorSMM } },
              { name: "PBF (%)", symbol: { fill: colorPBF } },
            ]}
          />

          <VictoryAxis
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            style={{
              tickLabels: {
                fontFamily,
                fontSize: fontSmall,
                fill: baseColor,
                angle: -45,
                textAnchor: "end",
              },
              axis: { stroke: baseColor },
            }}
          />

          <VictoryAxis
            dependentAxis
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

          <VictoryLine
            data={weightData}
            style={{
              data: { stroke: colorWeight, strokeWidth: 2 },
            }}
          />

          <VictoryLine
            data={smmData}
            style={{
              data: { stroke: colorSMM, strokeWidth: 2 },
            }}
          />

          <VictoryLine
            data={pbfData}
            style={{
              data: { stroke: colorPBF, strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </div>
    </Tile>
  );
}
