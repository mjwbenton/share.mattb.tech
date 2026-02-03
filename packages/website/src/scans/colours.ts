export const statusColors = {
  good: {
    solid: "#10b981",
    text: "#059669",
  },
  warning: {
    solid: "#f59e0b",
    text: "#d97706",
  },
  bad: {
    solid: "#ef4444",
    text: "#dc2626",
  },
} as const;

export const statusBackgrounds = {
  good: {
    light: "rgba(16, 185, 129, 0.2)",
    medium: "rgba(16, 185, 129, 0.3)",
    heavy: "rgba(16, 185, 129, 0.6)",
  },
  warning: {
    light: "rgba(245, 158, 11, 0.2)",
    medium: "rgba(245, 158, 11, 0.3)",
    heavy: "rgba(245, 158, 11, 0.6)",
  },
  bad: {
    light: "rgba(239, 68, 68, 0.2)",
    medium: "rgba(239, 68, 68, 0.3)",
    heavy: "rgba(239, 68, 68, 0.6)",
  },
} as const;

export const chartColors = {
  weight: "#10b981",
  smm: "#8b5cf6",
  pbf: "#f59e0b",
} as const;

export const badgeStyles = {
  good: {
    backgroundColor: statusBackgrounds.good.light,
    color: statusColors.good.text,
  },
  warning: {
    backgroundColor: statusBackgrounds.warning.light,
    color: statusColors.warning.text,
  },
  bad: {
    backgroundColor: statusBackgrounds.bad.light,
    color: statusColors.bad.text,
  },
} as const;

export const zoneStyles = {
  good: {
    fill: statusBackgrounds.good.heavy,
    stroke: statusColors.good.text,
  },
  warning: {
    fill: statusBackgrounds.warning.heavy,
    stroke: statusColors.warning.text,
  },
  bad: {
    fill: statusBackgrounds.bad.heavy,
    stroke: statusColors.bad.text,
  },
} as const;

export type StatusType = "good" | "warning" | "bad";
