import Tile from "component/Tile";
import { statusColors } from "./colours";

interface WeightControlCardProps {
  weightControl: {
    targetWeight: number;
    weightChange: number;
    fatChange: number;
    muscleChange: number;
  };
}

export default function WeightControlCard({
  weightControl,
}: WeightControlCardProps) {
  const formatChange = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)} kg`;
  };

  const getChangeColor = (value: number, inverse = false) => {
    if (value === 0) return undefined;
    const isPositive = inverse ? value < 0 : value > 0;
    return isPositive ? statusColors.good.solid : statusColors.warning.solid;
  };

  return (
    <Tile>
      <div className="flex flex-col py-4">
        <div className="text-sm mb-4">Weight Control</div>

        <div className="mb-4">
          <div className="text-xs text-dark-3 dark:text-light-3">
            Target Weight
          </div>
          <div className="text-2xl font-bold">
            {weightControl.targetWeight.toFixed(1)} kg
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-dark-3 dark:text-light-3">Weight</div>
            <div
              className="text-sm font-bold text-dark-2 dark:text-light-2"
              style={{
                color: getChangeColor(weightControl.weightChange, true),
              }}
            >
              {formatChange(weightControl.weightChange)}
            </div>
          </div>
          <div>
            <div className="text-xs text-dark-3 dark:text-light-3">Fat</div>
            <div
              className="text-sm font-bold text-dark-2 dark:text-light-2"
              style={{ color: getChangeColor(weightControl.fatChange, true) }}
            >
              {formatChange(weightControl.fatChange)}
            </div>
          </div>
          <div>
            <div className="text-xs text-dark-3 dark:text-light-3">Muscle</div>
            <div
              className="text-sm font-bold text-dark-2 dark:text-light-2"
              style={{ color: getChangeColor(weightControl.muscleChange) }}
            >
              {formatChange(weightControl.muscleChange)}
            </div>
          </div>
        </div>

        <div className="text-xs text-dark-3 dark:text-light-3 mt-2 text-center">
          Recommended changes to reach target
        </div>
      </div>
    </Tile>
  );
}
