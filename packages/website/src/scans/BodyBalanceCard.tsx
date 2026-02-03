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
  const styleMap: Record<
    BalanceStatus,
    { backgroundColor: string; color: string }
  > = {
    Balanced: { backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#059669" },
    SlightlyUnbalanced: {
      backgroundColor: "rgba(245, 158, 11, 0.2)",
      color: "#d97706",
    },
    Unbalanced: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#dc2626" },
  };

  const labelMap: Record<BalanceStatus, string> = {
    Balanced: "Balanced",
    SlightlyUnbalanced: "Slightly Unbalanced",
    Unbalanced: "Unbalanced",
  };

  return (
    <span className="px-2 py-1 rounded text-xs" style={styleMap[status]}>
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
