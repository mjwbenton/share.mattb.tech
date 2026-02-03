import Tile from "component/Tile";
import { statusColors, statusBackgrounds, badgeStyles } from "./colours";

interface VisceralFatGaugeProps {
  level: number;
}

export default function VisceralFatGauge({ level }: VisceralFatGaugeProps) {
  const maxLevel = 20;
  const levelPercent = (level / maxLevel) * 100;

  const getZoneColorValue = (l: number) => {
    if (l <= 9) return statusColors.good.solid;
    if (l <= 14) return statusColors.warning.solid;
    return statusColors.bad.solid;
  };

  const getZoneLabel = (l: number) => {
    if (l <= 9) return "Normal";
    if (l <= 14) return "High";
    return "Very High";
  };

  const getBadgeStyle = (l: number) => {
    if (l <= 9) return badgeStyles.good;
    if (l <= 14) return badgeStyles.warning;
    return badgeStyles.bad;
  };

  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Visceral Fat Level</div>

        <div className="flex items-center justify-center mb-4">
          <span
            className="text-4xl font-bold"
            style={{ color: getZoneColorValue(level) }}
          >
            {level}
          </span>
          <span className="text-dark-3 dark:text-light-3 ml-2">
            / {maxLevel}
          </span>
        </div>

        <div className="relative h-4 flex rounded overflow-hidden mb-2">
          <div
            style={{
              width: "45%",
              backgroundColor: statusBackgrounds.good.medium,
            }}
          />
          <div
            style={{
              width: "25%",
              backgroundColor: statusBackgrounds.warning.medium,
            }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: statusBackgrounds.bad.medium }}
          />
          <div
            className="absolute w-2 h-full rounded shadow-sm"
            style={{
              left: `${levelPercent}%`,
              transform: "translateX(-50%)",
              backgroundColor: getZoneColorValue(level),
            }}
          />
        </div>

        <div className="flex text-xs text-dark-3 dark:text-light-3">
          <div style={{ width: "45%" }} className="text-center">
            1-9 Normal
          </div>
          <div style={{ width: "25%" }} className="text-center">
            10-14 High
          </div>
          <div className="flex-1 text-center">15+ Very High</div>
        </div>

        <div className="text-center mt-4">
          <span
            className="px-2 py-1 rounded text-xs"
            style={getBadgeStyle(level)}
          >
            {getZoneLabel(level)}
          </span>
        </div>
      </div>
    </Tile>
  );
}
