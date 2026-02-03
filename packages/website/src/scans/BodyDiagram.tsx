import { SegmentalMeasurement } from "./types";
import { zoneStyles } from "./colours";

interface BodyDiagramProps {
  data: SegmentalMeasurement;
  type: "lean" | "fat";
}

function getSegmentStyle(percent: number, type: "lean" | "fat") {
  // For lean mass: under (<90%) is bad (amber), normal is green, over is usually fine
  // For fat mass: under is good, over (>110%) is bad (red)
  if (type === "lean") {
    if (percent < 90) return zoneStyles.warning;
    if (percent > 110) return zoneStyles.bad;
    return zoneStyles.good;
  } else {
    if (percent < 90) return zoneStyles.good;
    if (percent > 110) return zoneStyles.bad;
    return zoneStyles.warning;
  }
}

export default function BodyDiagram({ data, type }: BodyDiagramProps) {
  return (
    <div className="relative w-48 h-64 mx-auto">
      <svg viewBox="0 0 120 180" className="w-full h-full">
        {/* Head */}
        <circle
          cx="60"
          cy="20"
          r="15"
          className="fill-light-2 dark:fill-dark-2 stroke-dark-3 dark:stroke-light-3"
          strokeWidth="1"
        />

        {/* Trunk */}
        <rect
          x="35"
          y="40"
          width="50"
          height="60"
          rx="5"
          style={getSegmentStyle(data.trunk.percent, type)}
          strokeWidth="2"
        />

        {/* Left Arm */}
        <rect
          x="8"
          y="42"
          width="20"
          height="50"
          rx="5"
          style={getSegmentStyle(data.leftArm.percent, type)}
          strokeWidth="2"
        />

        {/* Right Arm */}
        <rect
          x="92"
          y="42"
          width="20"
          height="50"
          rx="5"
          style={getSegmentStyle(data.rightArm.percent, type)}
          strokeWidth="2"
        />

        {/* Left Leg */}
        <rect
          x="38"
          y="105"
          width="20"
          height="60"
          rx="5"
          style={getSegmentStyle(data.leftLeg.percent, type)}
          strokeWidth="2"
        />

        {/* Right Leg */}
        <rect
          x="62"
          y="105"
          width="20"
          height="60"
          rx="5"
          style={getSegmentStyle(data.rightLeg.percent, type)}
          strokeWidth="2"
        />
      </svg>

      {/* Data labels */}
      <div className="absolute top-10 left-0 text-xs text-center w-8">
        <div className="font-bold">{data.leftArm.mass}</div>
        <div className="text-dark-3 dark:text-light-3">
          {data.leftArm.percent.toFixed(0)}%
        </div>
      </div>

      <div className="absolute top-10 right-0 text-xs text-center w-8">
        <div className="font-bold">{data.rightArm.mass}</div>
        <div className="text-dark-3 dark:text-light-3">
          {data.rightArm.percent.toFixed(0)}%
        </div>
      </div>

      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-xs text-center">
        <div className="font-bold">{data.trunk.mass}</div>
        <div className="text-dark-3 dark:text-light-3">
          {data.trunk.percent.toFixed(0)}%
        </div>
      </div>

      <div className="absolute bottom-4 left-8 text-xs text-center w-8">
        <div className="font-bold">{data.leftLeg.mass}</div>
        <div className="text-dark-3 dark:text-light-3">
          {data.leftLeg.percent.toFixed(0)}%
        </div>
      </div>

      <div className="absolute bottom-4 right-8 text-xs text-center w-8">
        <div className="font-bold">{data.rightLeg.mass}</div>
        <div className="text-dark-3 dark:text-light-3">
          {data.rightLeg.percent.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
