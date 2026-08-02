import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { useQuery } from "@apollo/client";
import {
  ActivityPagePart1Query,
  ActivityPagePart2Query,
} from "generated/graphql";
import { buildActivityVariables } from "./activitySummaryDataProvider";

// The full activity query was previously a single operation, but it grew large
// enough that the GET request URL exceeded server limits and returned a 414.
// It is split into two operations that are fetched in parallel and merged back
// into a single result.

const ActivitySummaryData = gql`
  fragment ActivitySummaryData on Activity {
    walkingRunningDistance {
      km
    }
    swimmingDistance {
      km
    }
  }
`;

const ActivityChartData = gql`
  fragment ActivityChartData on Activity {
    walkingRunningDistance {
      months {
        km
        month
        year
      }
      days {
        km
        date
      }
    }
    swimmingDistance {
      months {
        km
        month
        year
      }
      days {
        km
        date
      }
    }
  }
`;

const RunningChartData = gql`
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
`;

const RunSpeedData = gql`
  fragment RunSpeedData on Activity {
    runningWorkouts: workouts(type: "outdoor_run") {
      months {
        year
        month
        speed {
          spm
        }
      }
    }
  }
`;

const StrengthChartData = gql`
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
`;

const StrengthDurationData = gql`
  fragment StrengthDurationData on Activity {
    strengthWorkouts: workouts(
      types: ["functional_strength_training", "traditional_strength_training"]
    ) {
      count
      durationSeconds
      activeEnergyBurned
    }
  }
`;

const StrengthWorkoutData = gql`
  fragment StrengthWorkoutData on Activity {
    strengthWorkouts: workouts(
      types: ["functional_strength_training", "traditional_strength_training"]
    ) {
      count
      durationSeconds
      activeEnergyBurned
      workouts {
        startTime
        durationSeconds
        activeEnergyBurned
      }
    }
  }
`;

const SwimSpeedData = gql`
  fragment SwimSpeedData on Activity {
    swimWorkouts: workouts(type: "pool_swim") {
      count
      speed {
        spm
        mps
      }
      activeEnergyBurned
      months {
        year
        month
        speed {
          spm
          mps
        }
      }
    }
  }
`;

const SwimWorkoutData = gql`
  fragment SwimWorkoutData on Activity {
    swimWorkouts: workouts(type: "pool_swim") {
      count
      speed {
        spm
        mps
      }
      activeEnergyBurned
      workouts {
        startTime
        durationSeconds
        distance {
          km
        }
        speed {
          spm
        }
      }
    }
  }
`;

const RunningWorkoutData = gql`
  fragment RunningWorkoutData on Activity {
    runningWorkouts: workouts(type: "outdoor_run") {
      count
      durationSeconds
      distance {
        km
      }
      workouts {
        startTime
        durationSeconds
        distance {
          km
        }
      }
    }
  }
`;

const QUERY_1 = gql`
  query ActivityPagePart1(
    $startOfYear: Date!
    $today: Date!
    $startOfPreviousYear: Date!
    $endOfPreviousYear: Date!
    $todayLastYear: Date!
  ) {
    thisYear: activity(startDate: $startOfYear, endDate: $today) {
      ...ActivityChartData
      ...ActivitySummaryData
      ...SwimSpeedData
      ...RunningChartData
      ...RunSpeedData
      ...StrengthChartData
    }
    lastYear: activity(
      startDate: $startOfPreviousYear
      endDate: $endOfPreviousYear
    ) {
      ...ActivityChartData
      ...SwimSpeedData
      ...RunningChartData
      ...RunSpeedData
      ...StrengthChartData
    }
    lastYearToDate: activity(
      startDate: $startOfPreviousYear
      endDate: $todayLastYear
    ) {
      ...ActivitySummaryData
    }
  }
  ${ActivityChartData}
  ${ActivitySummaryData}
  ${SwimSpeedData}
  ${RunningChartData}
  ${RunSpeedData}
  ${StrengthChartData}
`;

const QUERY_2 = gql`
  query ActivityPagePart2(
    $today: Date!
    $thirtyDaysAgo: Date!
    $thirtyDaysAgoLastYear: Date!
    $todayLastYear: Date!
    $thirtyOneDaysAgo: Date!
    $sixtyOneDaysAgo: Date!
  ) {
    trailing30Days: activity(startDate: $thirtyDaysAgo, endDate: $today) {
      ...ActivitySummaryData
      ...SwimWorkoutData
      ...StrengthWorkoutData
      ...RunningWorkoutData
    }
    previous30Days: activity(
      startDate: $sixtyOneDaysAgo
      endDate: $thirtyOneDaysAgo
    ) {
      ...SwimSpeedData
      ...StrengthDurationData
      ...RunningWorkoutData
    }
    lastYearTrailing30Days: activity(
      startDate: $thirtyDaysAgoLastYear
      endDate: $todayLastYear
    ) {
      ...ActivitySummaryData
    }
  }
  ${ActivitySummaryData}
  ${SwimWorkoutData}
  ${StrengthWorkoutData}
  ${RunningWorkoutData}
  ${SwimSpeedData}
  ${StrengthDurationData}
`;

export type ActivityPageQuery = ActivityPagePart1Query & ActivityPagePart2Query;

const activityPageDataProvider: DataProvider<never, ActivityPageQuery> = async (
  _: never,
  { client },
) => {
  const variables = buildActivityVariables();
  const [result1, result2] = await Promise.all([
    client.query<ActivityPagePart1Query>({ query: QUERY_1, variables }),
    client.query<ActivityPagePart2Query>({ query: QUERY_2, variables }),
  ]);
  return { ...result1.data, ...result2.data };
};

export default activityPageDataProvider;

export function useActivityPage() {
  const variables = buildActivityVariables();
  const { data: data1, loading: loading1 } = useQuery<ActivityPagePart1Query>(
    QUERY_1,
    {
      variables,
      fetchPolicy: "cache-and-network",
    },
  );
  const { data: data2, loading: loading2 } = useQuery<ActivityPagePart2Query>(
    QUERY_2,
    {
      variables,
      fetchPolicy: "cache-and-network",
    },
  );
  return {
    loading: loading1 || loading2,
    activity: data1 && data2 ? { ...data1, ...data2 } : undefined,
  };
}
