import Tile from "component/Tile";

interface VisceralFatGaugeProps {
  level: number;
}

export default function VisceralFatGauge({ level }: VisceralFatGaugeProps) {
  const maxLevel = 20;
  const levelPercent = (level / maxLevel) * 100;

  const getZoneColorValue = (l: number) => {
    if (l <= 9) return "#10b981"; // emerald-500
    if (l <= 14) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getZoneLabel = (l: number) => {
    if (l <= 9) return "Normal";
    if (l <= 14) return "High";
    return "Very High";
  };

  const getBadgeStyle = (l: number) => {
    if (l <= 9)
      return { backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#059669" };
    if (l <= 14)
      return { backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#d97706" };
    return { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#dc2626" };
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
            style={{ width: "45%", backgroundColor: "rgba(16, 185, 129, 0.3)" }}
          />
          <div
            style={{ width: "25%", backgroundColor: "rgba(245, 158, 11, 0.3)" }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.3)" }}
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
