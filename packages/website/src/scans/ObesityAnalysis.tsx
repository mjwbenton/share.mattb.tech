import Tile from "component/Tile";
import { statusColors, statusBackgrounds } from "./colours";

interface ObesityAnalysisProps {
  obesityAnalysis: {
    bmi: number;
    percentBodyFat: number;
  };
}

interface Zone {
  max: number;
  label: string;
  bgColor: string;
  markerColor: string;
}

interface ObesityBarProps {
  label: string;
  value: number;
  zones: Zone[];
  unit: string;
}

function ObesityBar({ label, value, zones, unit }: ObesityBarProps) {
  const totalMax = zones[zones.length - 1].max;
  const valuePercent = Math.min(100, (value / totalMax) * 100);

  let currentZone = zones[0];
  for (const zone of zones) {
    if (value <= zone.max) {
      currentZone = zone;
      break;
    }
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-bold">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="relative h-4 flex rounded overflow-hidden">
        {zones.map((zone, i) => {
          const prevMax = i > 0 ? zones[i - 1].max : 0;
          const width = ((zone.max - prevMax) / totalMax) * 100;
          return (
            <div
              key={zone.label}
              style={{ width: `${width}%`, backgroundColor: zone.bgColor }}
            />
          );
        })}
        <div
          className="absolute w-2 h-full rounded shadow-sm"
          style={{
            left: `${valuePercent}%`,
            transform: "translateX(-50%)",
            backgroundColor: currentZone.markerColor,
          }}
        />
      </div>
      <div className="flex text-xs text-dark-3 dark:text-light-3 mt-1">
        {zones.map((zone, i) => {
          const prevMax = i > 0 ? zones[i - 1].max : 0;
          const width = ((zone.max - prevMax) / totalMax) * 100;
          return (
            <div
              key={zone.label}
              style={{ width: `${width}%` }}
              className="text-center"
            >
              {zone.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ObesityAnalysis({
  obesityAnalysis,
}: ObesityAnalysisProps) {
  const bmiZones: Zone[] = [
    {
      max: 18.5,
      label: "Under",
      bgColor: statusBackgrounds.warning.medium,
      markerColor: statusColors.warning.solid,
    },
    {
      max: 25,
      label: "Normal",
      bgColor: statusBackgrounds.good.medium,
      markerColor: statusColors.good.solid,
    },
    {
      max: 30,
      label: "Over",
      bgColor: statusBackgrounds.warning.medium,
      markerColor: statusColors.warning.solid,
    },
    {
      max: 40,
      label: "Obese",
      bgColor: statusBackgrounds.bad.medium,
      markerColor: statusColors.bad.solid,
    },
  ];

  const pbfZones: Zone[] = [
    {
      max: 10,
      label: "Under",
      bgColor: statusBackgrounds.warning.medium,
      markerColor: statusColors.warning.solid,
    },
    {
      max: 20,
      label: "Normal",
      bgColor: statusBackgrounds.good.medium,
      markerColor: statusColors.good.solid,
    },
    {
      max: 25,
      label: "Over",
      bgColor: statusBackgrounds.warning.medium,
      markerColor: statusColors.warning.solid,
    },
    {
      max: 40,
      label: "Obese",
      bgColor: statusBackgrounds.bad.medium,
      markerColor: statusColors.bad.solid,
    },
  ];

  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Obesity Analysis</div>

        <ObesityBar
          label="BMI"
          value={obesityAnalysis.bmi}
          zones={bmiZones}
          unit=""
        />
        <ObesityBar
          label="Percent Body Fat"
          value={obesityAnalysis.percentBodyFat}
          zones={pbfZones}
          unit="%"
        />
      </div>
    </Tile>
  );
}
