import Tile from "component/Tile";
import { BalanceStatus } from "./types";

interface BodyBalanceCardProps {
  bodyBalance: {
    upper: BalanceStatus;
    lower: BalanceStatus;
    upperLower: BalanceStatus;
  };
}

function BalanceBadge({ status }: { status: BalanceStatus }) {
  const colorMap: Record<BalanceStatus, string> = {
    Balanced: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    SlightlyUnbalanced: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    Unbalanced: "bg-red-500/20 text-red-600 dark:text-red-400",
  };

  const labelMap: Record<BalanceStatus, string> = {
    Balanced: "Balanced",
    SlightlyUnbalanced: "Slightly Unbalanced",
    Unbalanced: "Unbalanced",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

export default function BodyBalanceCard({ bodyBalance }: BodyBalanceCardProps) {
  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Body Balance</div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Upper Body</span>
            <BalanceBadge status={bodyBalance.upper} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Lower Body</span>
            <BalanceBadge status={bodyBalance.lower} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Upper-Lower</span>
            <BalanceBadge status={bodyBalance.upperLower} />
          </div>
        </div>
      </div>
    </Tile>
  );
}
