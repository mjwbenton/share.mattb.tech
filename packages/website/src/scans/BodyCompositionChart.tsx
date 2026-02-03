import Tile from "component/Tile";
import { BodyScansData } from "./types";
import { statusColors, statusBackgrounds } from "./colours";

interface BodyCompositionChartProps {
  composition: {
    totalBodyWater: number;
    protein: number;
    minerals: number;
    bodyFatMass: number;
    weight: number;
  };
  referenceRanges: BodyScansData["referenceRanges"];
}

interface CompositionBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

function CompositionBar({ label, value, min, max, unit }: CompositionBarProps) {
  const range = max - min;
  const extendedMin = min - range * 0.3;
  const extendedMax = max + range * 0.3;
  const totalRange = extendedMax - extendedMin;

  const normalStartPercent = ((min - extendedMin) / totalRange) * 100;
  const normalWidthPercent = ((max - min) / totalRange) * 100;
  const valuePercent = Math.max(
    0,
    Math.min(100, ((value - extendedMin) / totalRange) * 100),
  );

  const isInRange = value >= min && value <= max;
  const markerBgColor = isInRange
    ? statusColors.good.solid
    : statusColors.warning.solid;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="relative h-6 bg-light-2 dark:bg-dark-2 rounded">
        <div
          className="absolute h-full rounded"
          style={{
            left: `${normalStartPercent}%`,
            width: `${normalWidthPercent}%`,
            backgroundColor: statusBackgrounds.good.medium,
          }}
        />
        <div
          className="absolute w-2 h-full rounded shadow-sm"
          style={{
            left: `${valuePercent}%`,
            transform: "translateX(-50%)",
            backgroundColor: markerBgColor,
          }}
        />
        <div
          className="absolute text-xs text-dark-3 dark:text-light-3 -bottom-4"
          style={{ left: `${normalStartPercent}%` }}
        >
          {min.toFixed(1)}
        </div>
        <div
          className="absolute text-xs text-dark-3 dark:text-light-3 -bottom-4"
          style={{
            left: `${normalStartPercent + normalWidthPercent}%`,
            transform: "translateX(-100%)",
          }}
        >
          {max.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

export default function BodyCompositionChart({
  composition,
  referenceRanges,
}: BodyCompositionChartProps) {
  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-6">Body Composition Analysis</div>

        <div className="space-y-6">
          <CompositionBar
            label="Total Body Water"
            value={composition.totalBodyWater}
            min={referenceRanges.totalBodyWater[0]}
            max={referenceRanges.totalBodyWater[1]}
            unit="L"
          />
          <CompositionBar
            label="Protein"
            value={composition.protein}
            min={referenceRanges.protein[0]}
            max={referenceRanges.protein[1]}
            unit="kg"
          />
          <CompositionBar
            label="Minerals"
            value={composition.minerals}
            min={referenceRanges.minerals[0]}
            max={referenceRanges.minerals[1]}
            unit="kg"
          />
          <CompositionBar
            label="Body Fat Mass"
            value={composition.bodyFatMass}
            min={referenceRanges.bodyFatMass[0]}
            max={referenceRanges.bodyFatMass[1]}
            unit="kg"
          />
          <CompositionBar
            label="Weight"
            value={composition.weight}
            min={referenceRanges.weight[0]}
            max={referenceRanges.weight[1]}
            unit="kg"
          />
        </div>
      </div>
    </Tile>
  );
}
