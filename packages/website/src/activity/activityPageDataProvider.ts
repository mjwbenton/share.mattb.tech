import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { useQuery } from "@apollo/client";
import { ActivityPageQuery } from "generated/graphql";
import { buildActivityVariables } from "./activitySummaryDataProvider";

const QUERY = gql`
  query ActivityPage(
    $startOfYear: Date!
    $today: Date!
    $thirtyDaysAgo: Date!
    $startOfPreviousYear: Date!
    $todayLastYear: Date!
    $thirtyDaysAgoLastYear: Date!
    $endOfPreviousYear: Date!
    $thirtyOneDaysAgo: Date!
    $sixtyOneDaysAgo: Date!
  ) {
    thisYear: activity(startDate: $startOfYear, endDate: $today) {
      ...ActivityChartData
      ...ActivitySummaryData
      ...SwimSpeedData
    }
    lastYear: activity(
      startDate: $startOfPreviousYear
      endDate: $endOfPreviousYear
    ) {
      ...ActivityChartData
      ...SwimSpeedData
    }
    lastYearToDate: activity(
      startDate: $startOfPreviousYear
      endDate: $todayLastYear
    ) {
      ...ActivitySummaryData
    }
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

  fragment ActivitySummaryData on Activity {
    walkingRunningDistance {
      km
    }
    swimmingDistance {
      km
    }
  }

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

  fragment StrengthDurationData on Activity {
    strengthWorkouts: workouts(type: "functional_strength_training") {
      count
      durationSeconds
      activeEnergyBurned
    }
  }

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

const activityPageDataProvider: DataProvider<never, ActivityPageQuery> = async (
  _: never,
  { client },
) => {
  const result = await client.query<ActivityPageQuery>({
    query: QUERY,
    variables: buildActivityVariables(),
  });
  return result.data;
};

export default activityPageDataProvider;

export function useActivityPage() {
  const { data, loading } = useQuery<ActivityPageQuery>(QUERY, {
    variables: buildActivityVariables(),
    fetchPolicy: "cache-and-network",
  });
  return {
    loading,
    activity: data,
  };
}
