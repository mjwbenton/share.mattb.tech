# Plan: Add Charts to Running and Strength Training Sections

## Context

The activity page has four sections: Walking, Swimming, Running, and Strength Training. Walking and Swimming both have two chart types: a bar chart showing distance by month and a line chart showing cumulative distance over the year. Running and Strength Training currently only have summary tiles and a recent workouts list — no charts.

The goal is to add equivalent "by month" and "cumulative time" charts to both sections.

## Key Findings from Schema Introspection

`WorkoutTotal` (returned by `workouts()`) now exposes both:
- `months` → `WorkoutMonth[]`: `{ year, month, count, durationSeconds, activeEnergyBurned, distance { km }, speed }`
- `days` → `WorkoutDay[]`: `{ date, count, durationSeconds, activeEnergyBurned, distance { km }, speed }`

This enables day-by-day cumulative charts for both running and strength — same granularity as swimming/walking.

## Implementation Plan

### Step 1: Update GraphQL query
**File:** `packages/website/src/activity/activityPageDataProvider.ts`

Add two new fragments and include them in `thisYear` and `lastYear` activity queries:

```graphql
fragment RunningChartData on Activity {
  runningWorkouts: workouts(type: "outdoor_run") {
    months {
      month
      year
      distance {
        km
      }
    }
    days {
      date
      distance {
        km
      }
    }
  }
}

fragment StrengthChartData on Activity {
  strengthWorkouts: workouts(
    types: ["functional_strength_training", "traditional_strength_training"]
  ) {
    months {
      month
      year
      durationSeconds
    }
    days {
      date
      durationSeconds
    }
  }
}
```

Add `...RunningChartData` and `...StrengthChartData` to the `thisYear` and `lastYear` activity aliases in the main query.

**Note:** Both fragments alias the same `workouts()` fields as existing fragments (`runningWorkouts`, `strengthWorkouts`). Apollo/codegen merges fields from the same alias — the `months` and `days` fields will be added to the existing types.

### Step 2: Regenerate GraphQL types
```bash
yarn workspace @mattb.tech/lonesome-website codegen
```

### Step 3: Update `RunningSection.tsx`
**File:** `packages/website/src/activity/RunningSection.tsx`

Running distance (km) maps directly to the shapes expected by `DistanceBarChart` and `DistanceAccumulationChart` — no new chart components needed. Add both charts between the `<Wall>` tiles and the `<Expander>`:

```tsx
import DistanceBarChart from "./DistanceBarChart";
import DistanceAccumulationChart from "./DistanceAccumulationChart";

// In JSX:
<DistanceBarChart
  data={{
    thisYear: (activity?.thisYear.runningWorkouts?.months ?? []).map(
      (m) => ({ month: m.month, km: m.distance?.km ?? 0 })
    ),
    lastYear: (activity?.lastYear.runningWorkouts?.months ?? []).map(
      (m) => ({ month: m.month, km: m.distance?.km ?? 0 })
    ),
  }}
/>
<DistanceAccumulationChart
  data={{
    thisYear: (activity?.thisYear.runningWorkouts?.days ?? []).map(
      (d) => ({ date: d.date, km: d.distance?.km ?? 0 })
    ),
    lastYear: (activity?.lastYear.runningWorkouts?.days ?? []).map(
      (d) => ({ date: d.date, km: d.distance?.km ?? 0 })
    ),
  }}
/>
```

### Step 4: Create `DurationBarChart.tsx`
**File:** `packages/website/src/activity/DurationBarChart.tsx`

Clone of `DistanceBarChart.tsx` for duration data. Differences:
- Data type uses `durationSeconds: number` instead of `km: number`
- Tooltip label: `formatDuration(datum.durationSeconds)`
- Chart title: `"Training time by month"`
- Y-axis tick format: convert seconds to `formatDuration`

```ts
export type DurationBarChartData = {
  readonly thisYear: readonly { readonly month: number; readonly durationSeconds: number }[];
  readonly lastYear: readonly { readonly month: number; readonly durationSeconds: number }[];
};
```

### Step 5: Create `DurationAccumulationChart.tsx`
**File:** `packages/website/src/activity/DurationAccumulationChart.tsx`

Clone of `DistanceAccumulationChart.tsx` for duration data. Differences:
- Data type uses `{ date: string, durationSeconds: number }` instead of `{ date: string, km: number }`
- `accumulateDays()` accumulates `durationSeconds` instead of `km`
- Tooltip label: `formatDuration(datum.durationSeconds)`
- Chart title: `"Accumulated training time"`
- Y-axis tick format: convert seconds to `formatDuration`

```ts
export type DurationAccumulationChartData = {
  readonly thisYear: readonly { readonly date: string; readonly durationSeconds: number }[];
  readonly lastYear: readonly { readonly date: string; readonly durationSeconds: number }[];
};
```

### Step 6: Update `StrengthSection.tsx`
**File:** `packages/website/src/activity/StrengthSection.tsx`

Add both charts between the `<Wall>` tiles and the `<Expander>`:

```tsx
import DurationBarChart from "./DurationBarChart";
import DurationAccumulationChart from "./DurationAccumulationChart";

// In JSX:
<DurationBarChart
  data={{
    thisYear: activity?.thisYear.strengthWorkouts?.months ?? [],
    lastYear: activity?.lastYear.strengthWorkouts?.months ?? [],
  }}
/>
<DurationAccumulationChart
  data={{
    thisYear: activity?.thisYear.strengthWorkouts?.days ?? [],
    lastYear: activity?.lastYear.strengthWorkouts?.days ?? [],
  }}
/>
```

## Critical Files

- `packages/website/src/activity/activityPageDataProvider.ts` — add fragments + query fields
- `packages/website/src/generated/graphql.tsx` — regenerated by codegen (do not hand-edit)
- `packages/website/src/activity/RunningSection.tsx` — add chart imports + usage (reuses existing `DistanceBarChart` + `DistanceAccumulationChart`)
- `packages/website/src/activity/DurationBarChart.tsx` — new component (create)
- `packages/website/src/activity/DurationAccumulationChart.tsx` — new component (create)
- `packages/website/src/activity/StrengthSection.tsx` — add chart imports + usage

## Existing Components to Reuse

- `DistanceBarChart` from `./DistanceBarChart` — reused for running (distance data maps cleanly to `{ month, km }`)
- `DistanceAccumulationChart` from `./DistanceAccumulationChart` — reused for running (day data maps to `{ date, km }`)
- `useChartTheme` from `./useChartTheme` — used in both new duration chart components
- `formatDuration` from `./format` — for duration tooltip and axis labels in new components
- Victory.js components — same imports as existing charts

## Verification

1. `yarn workspace @mattb.tech/lonesome-website codegen` — should succeed without errors
2. `yarn check` — TypeScript should compile cleanly
3. `yarn dev` and visit the activity page
4. Running section has two new charts: distance by month (bar) and accumulated distance (line, day-by-day)
5. Strength Training section has two new charts: training time by month (bar) and accumulated training time (line, day-by-day)
6. Charts respond to dark/light mode toggle
7. Tooltips appear on hover
