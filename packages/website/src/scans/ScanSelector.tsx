import { BodyScan } from "./types";

interface ScanSelectorProps {
  scans: BodyScan[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function ScanSelector({
  scans,
  selectedIndex,
  onSelect,
}: ScanSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-dark-3 dark:text-light-3">Scan date:</span>
      {scans.map((scan, index) => (
        <button
          key={scan.date}
          onClick={() => onSelect(index)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            index === selectedIndex
              ? "bg-accent-light text-white dark:bg-accent-dark"
              : "bg-light-1 dark:bg-dark-1 hover:bg-light-2 dark:hover:bg-dark-2"
          }`}
        >
          {scan.date}
        </button>
      ))}
    </div>
  );
}
