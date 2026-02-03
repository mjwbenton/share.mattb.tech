import { SegmentalImpedance } from "./types";

interface ImpedanceTableProps {
  impedance: SegmentalImpedance;
}

export default function ImpedanceTable({ impedance }: ImpedanceTableProps) {
  const segments = [
    { key: "rightArm" as const, label: "Right Arm" },
    { key: "leftArm" as const, label: "Left Arm" },
    { key: "trunk" as const, label: "Trunk" },
    { key: "rightLeg" as const, label: "Right Leg" },
    { key: "leftLeg" as const, label: "Left Leg" },
  ];

  return (
    <div className="mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-3 dark:border-light-3">
            <th className="text-left py-2">Segment</th>
            <th className="text-right py-2">20kHz (Ohm)</th>
            <th className="text-right py-2">100kHz (Ohm)</th>
          </tr>
        </thead>
        <tbody>
          {segments.map(({ key, label }) => (
            <tr
              key={key}
              className="border-b border-light-2 dark:border-dark-2"
            >
              <td className="py-2">{label}</td>
              <td className="text-right py-2">
                {impedance[key]["20kHz"].toFixed(1)}
              </td>
              <td className="text-right py-2">
                {impedance[key]["100kHz"].toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
