import gql from "graphql-tag";
import { DataProvider, usePageData } from "@mattb.tech/data-fetching";
import { CountsBetweenDatesQuery } from "generated/graphql";
import YEAR_VALUES from "../../data/yearValues.json";
import { ApolloClient, NormalizedCacheObject, useQuery } from "@apollo/client";
import { formatISO } from "date-fns/formatISO";
import { subYears } from "date-fns/subYears";
import { useMemo } from "react";

const TV_SERIES_LIMIT = 100;

const QUERY = gql`
  query CountsBetweenDates(
    $startDateTime: DateTime!
    $endDateTime: DateTime!
    $startDate: Date!
    $endDate: Date!
    $tvSeriesLimit: Int!
  ) {
    photos(first: 0, startDate: $startDateTime, endDate: $endDateTime) {
      total
    }
    commitStats(startDate: $startDateTime, endDate: $endDateTime) {
      commits
      repositoriesCommittedTo
    }
    books(
      first: 0
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: ADDED_AT
    ) {
      total
    }
    readBooks: bookShelf(id: Read) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    gaveUpBooks: bookShelf(id: DidNotFinish) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    features(
      first: 0
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: ADDED_AT
    ) {
      total
    }
    tvSeasons(
      first: 0
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: ADDED_AT
    ) {
      total
    }
    finishedTvSeasons: tvSeasonShelf(id: FinishedSeason) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    gaveUpTvSeasons: tvSeasonShelf(id: GaveUp) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    videoGames(
      first: 0
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: ADDED_AT
    ) {
      total
    }
    completedVideoGames: videoGameShelf(id: Completed) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    gaveUpVideoGames: videoGameShelf(id: GaveUp) {
      items(
        first: 0
        startDate: $startDateTime
        endDate: $endDateTime
        sortBy: MOVED_AT
      ) {
        total
      }
    }
    tvSeries(
      first: $tvSeriesLimit
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: MOVED_AT
    ) {
      total
      items {
        shelf {
          id
        }
        seasons {
          id
        }
      }
    }
    activity(startDate: $startDate, endDate: $endDate) {
      swimmingDistance {
        km
      }
      walkingRunningDistance {
        km
      }
      workouts {
        count
        durationSeconds
      }
    }
    plays(first: 0, startDate: $startDateTime, endDate: $endDateTime) {
      total
    }
  }
`;

export type YearCounts = {
  year: number;
  photos: number;
  books: {
    started: number;
    finished: number;
    gaveUp: number;
  };
  features: {
    watched: number;
  };
  videoGames: {
    started: number;
    completed: number;
    gaveUp: number;
  };
  tvSeasons: {
    started: number;
    finished: number;
    gaveUp: number;
  };
  commitStats: {
    commits: number;
    repositoriesCommittedTo: number;
  };
  activity: {
    walkingRunningDistance: number;
    swimmingDistance: number;
    workouts: {
      count: number;
      duration: number;
    };
  };
  tracks: {
    listened: number;
  };
};

export type YearData = {
  year: YearCounts;
  previousYear: YearCounts;
};

async function fetchForYear(
  client: ApolloClient<NormalizedCacheObject>,
  year: number,
  overrideEndDate?: Date,
): Promise<YearCounts> {
  const result = await client.query<CountsBetweenDatesQuery>({
    query: QUERY,
    variables: buildYearQueryVariables(year, overrideEndDate),
  });
  const value = transformResult(year, result.data);
  // Check the values are those expected – hacky test to see if any code changes
  // accidentally cause these values to change after the fact
  const yearKey = String(year) as keyof typeof YEAR_VALUES;
  if (
    !overrideEndDate &&
    yearKey in YEAR_VALUES &&
    JSON.stringify(value) !== JSON.stringify(YEAR_VALUES[yearKey])
  ) {
    console.log(JSON.stringify(value, null, 2));
    throw new Error(`Year values for ${year} have changed unexpectedly`);
  }
  return value;
}

const yearReviewDataProvider: DataProvider<
  { filterYear: number },
  YearData
> = async ({ filterYear }, { client }) => {
  if (isCurrentYear(filterYear)) {
    return {
      filterYear,
      year: await fetchForYear(client, filterYear, new Date()),
      previousYear: await fetchForYear(
        client,
        filterYear - 1,
        subYears(new Date(), 1),
      ),
    };
  }
  return {
    year: await fetchForYear(client, filterYear),
    previousYear: await fetchForYear(client, filterYear - 1),
  };
};

export default yearReviewDataProvider;

/**
 * Hook to load data directly from the API
 * Skips fetching unless its the current year
 */
export function useLiveYearReviewData(year: number) {
  const currentYearVariables = useMemo(
    () =>
      buildYearQueryVariables(
        year,
        isCurrentYear(year) ? new Date() : undefined,
      ),
    [year],
  );

  const previousYearVariables = useMemo(
    () =>
      buildYearQueryVariables(
        year - 1,
        isCurrentYear(year) ? subYears(new Date(), 1) : undefined,
      ),
    [year],
  );

  const { data: currentYearData, loading: currentYearLoading } =
    useQuery<CountsBetweenDatesQuery>(QUERY, {
      variables: currentYearVariables,
      skip: !isCurrentYear(year),
      fetchPolicy: "network-only",
    });

  const { data: previousYearData, loading: previousYearLoading } =
    useQuery<CountsBetweenDatesQuery>(QUERY, {
      variables: previousYearVariables,
      skip: !isCurrentYear(year),
      fetchPolicy: "network-only",
    });

  return {
    loading: currentYearLoading || previousYearLoading,
    year: currentYearData ? transformResult(year, currentYearData) : undefined,
    previousYear: previousYearData
      ? transformResult(year - 1, previousYearData)
      : undefined,
  };
}

/*
 * Hook to combine data from build time with data live from the API
 * Uses build data unless its the in progress year, in which case use the
 * build data only until the live data has loaded
 */
export function useYearReviewData(): { loading: boolean } & YearData {
  const fromPage: YearData = usePageData();
  const filterYear = fromPage.year.year;
  const live: { loading: boolean } & Partial<YearData> =
    useLiveYearReviewData(filterYear);
  if (isCurrentYear(filterYear)) {
    return {
      loading: live.loading,
      year: live.year ?? fromPage.year,
      previousYear: live.previousYear ?? fromPage.previousYear,
    };
  } else {
    return {
      loading: false,
      year: fromPage.year,
      previousYear: fromPage.previousYear,
    };
  }
}

function isCurrentYear(year: number) {
  return year === new Date().getFullYear();
}

function buildYearQueryVariables(
  year: number,
  overrideEndDate?: Date | undefined,
) {
  return {
    startDateTime: `${year}-01-01T00:00:00Z`,
    endDateTime: overrideEndDate
      ? formatISO(overrideEndDate)
      : `${year}-12-31T23:59:59Z`,
    startDate: `${year}-01-01`,
    endDate: overrideEndDate
      ? formatISO(overrideEndDate, { representation: "date" })
      : `${year}-12-31`,
    tvSeriesLimit: TV_SERIES_LIMIT,
  };
}

function transformResult(
  year: number,
  data: CountsBetweenDatesQuery,
): YearCounts {
  if (data.tvSeries.total > TV_SERIES_LIMIT) {
    throw new Error(
      `Total TV series (${data.tvSeries.total}) exceeds fetch limit (${TV_SERIES_LIMIT})`,
    );
  }
  const tvSeriesWithoutSeasons = data.tvSeries.items.filter(
    ({ seasons }) => seasons.length === 0,
  );
  const tvSeriesFinished = tvSeriesWithoutSeasons.filter(
    ({ shelf }) => shelf.id === "Finished",
  ).length;
  const tvSeriesGaveUp = tvSeriesWithoutSeasons.filter(
    ({ shelf }) => shelf.id === "GaveUp",
  ).length;
  const tvSeriesStarted = tvSeriesWithoutSeasons.filter(
    ({ shelf }) => shelf.id === "Watching",
  ).length;
  return {
    year,
    photos: data.photos.total,
    commitStats: {
      commits: data.commitStats.commits,
      repositoriesCommittedTo: data.commitStats.repositoriesCommittedTo,
    },
    books: {
      started: data.books.total,
      finished: data.readBooks?.items.total ?? 0,
      gaveUp: data.gaveUpBooks?.items.total ?? 0,
    },
    features: {
      watched: data.features.total,
    },
    videoGames: {
      started: data.videoGames.total,
      completed: data.completedVideoGames?.items.total ?? 0,
      gaveUp: data.gaveUpVideoGames?.items.total ?? 0,
    },
    tvSeasons: {
      started: data.tvSeasons.total + tvSeriesStarted,
      finished: data.finishedTvSeasons?.items.total ?? 0 + tvSeriesFinished,
      gaveUp: data.gaveUpTvSeasons?.items.total ?? 0 + tvSeriesGaveUp,
    },
    activity: {
      walkingRunningDistance: Math.floor(
        data.activity.walkingRunningDistance.km,
      ),
      swimmingDistance: Math.floor(data.activity.swimmingDistance.km),
      workouts: {
        count: data.activity.workouts?.count ?? 0,
        duration: data.activity.workouts?.durationSeconds ?? 0,
      },
    },
    tracks: {
      listened: data.plays.total,
    },
  };
}
