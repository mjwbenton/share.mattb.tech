import Tile from "component/Tile";
import { BodyScansData } from "./types";

interface MuscleFatAnalysisProps {
  smm: number;
  bodyFatMass: number;
  weight: number;
  referenceRanges: BodyScansData["referenceRanges"];
}

interface AnalysisBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

function AnalysisBar({ label, value, min, max, unit }: AnalysisBarProps) {
  const range = max - min;
  const underMax = min;
  const overMin = max;

  const totalSpan = range * 3;
  const startOffset = range;

  const underPercent = (range / totalSpan) * 100;
  const normalPercent = (range / totalSpan) * 100;

  let valuePercent: number;
  let zone: "under" | "normal" | "over";

  if (value < min) {
    zone = "under";
    const underRange = min - (min - range);
    valuePercent = ((value - (min - range)) / totalSpan) * 100;
    valuePercent = Math.max(0, valuePercent);
  } else if (value > max) {
    zone = "over";
    valuePercent = ((value - (min - range)) / totalSpan) * 100;
    valuePercent = Math.min(100, valuePercent);
  } else {
    zone = "normal";
    valuePercent = ((value - (min - range)) / totalSpan) * 100;
  }

  const zoneColorValues = {
    under: "#f59e0b", // amber-500
    normal: "#10b981", // emerald-500
    over: "#ef4444", // red-500
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="relative h-4 flex rounded overflow-hidden">
        <div
          style={{
            width: `${underPercent}%`,
            backgroundColor: "rgba(245, 158, 11, 0.3)",
          }}
        />
        <div
          style={{
            width: `${normalPercent}%`,
            backgroundColor: "rgba(16, 185, 129, 0.3)",
          }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.3)" }}
        />
        <div
          className="absolute w-2 h-full rounded shadow-sm"
          style={{
            left: `${valuePercent}%`,
            transform: "translateX(-50%)",
            backgroundColor: zoneColorValues[zone],
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-dark-3 dark:text-light-3 mt-1">
        <span>Under</span>
        <span>Normal</span>
        <span>Over</span>
      </div>
    </div>
  );
}

export default function MuscleFatAnalysis({
  smm,
  bodyFatMass,
  weight,
  referenceRanges,
}: MuscleFatAnalysisProps) {
  const smmRange: [number, number] = [28.0, 35.0];

  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Muscle-Fat Analysis</div>

        <AnalysisBar
          label="Weight"
          value={weight}
          min={referenceRanges.weight[0]}
          max={referenceRanges.weight[1]}
          unit="kg"
        />
        <AnalysisBar
          label="Skeletal Muscle Mass"
          value={smm}
          min={smmRange[0]}
          max={smmRange[1]}
          unit="kg"
        />
        <AnalysisBar
          label="Body Fat Mass"
          value={bodyFatMass}
          min={referenceRanges.bodyFatMass[0]}
          max={referenceRanges.bodyFatMass[1]}
          unit="kg"
        />
      </div>
    </Tile>
  );
}
