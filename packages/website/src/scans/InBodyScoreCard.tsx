import Tile from "component/Tile";
import { useEffect, useState } from "react";

interface InBodyScoreCardProps {
  score: number;
}

export default function InBodyScoreCard({ score }: InBodyScoreCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = (score / 100) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
                stroke="currentColor"
                className="text-dark-2 dark:text-light-2"
              />
            </svg>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-dark-2 dark:text-light-2">
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
