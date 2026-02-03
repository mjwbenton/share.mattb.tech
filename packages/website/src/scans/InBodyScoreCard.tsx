import Tile from "component/Tile";
import { useEffect, useState } from "react";
import { statusColors } from "./colours";

interface InBodyScoreCardProps {
  score: number;
}

export default function InBodyScoreCard({ score }: InBodyScoreCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const getScoreColor = (s: number) => {
    if (s < 60) return statusColors.warning.solid;
    if (s >= 80) return statusColors.good.solid;
    return undefined;
  };

  const percentage = (score / 100) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const scoreColor = getScoreColor(score);

  return (
    <Tile>
      <div className="flex flex-col items-center py-4">
        <div className="text-sm mb-2">InBody Score</div>
        <div className="relative w-32 h-32">
          {mounted && (
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-light-2 dark:text-dark-2"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                stroke={scoreColor ?? "currentColor"}
                className={
                  scoreColor ? undefined : "text-dark-2 dark:text-light-2"
                }
              />
            </svg>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-4xl font-bold ${scoreColor ? "" : "text-dark-2 dark:text-light-2"}`}
              style={scoreColor ? { color: scoreColor } : undefined}
            >
              {score}
            </span>
          </div>
        </div>
        <div className="text-xs mt-2 text-dark-3 dark:text-light-3">
          out of 100
        </div>
      </div>
    </Tile>
  );
}
