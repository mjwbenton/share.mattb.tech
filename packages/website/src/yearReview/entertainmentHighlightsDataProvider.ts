import gql from "graphql-tag";
import { DataProvider, usePageData } from "@mattb.tech/data-fetching";
import {
  BookFragment,
  FeatureFragment,
  VideoGameFragment,
  TvSeasonFragment,
} from "generated/graphql";
import { formatISO } from "date-fns/formatISO";
import { fragment as bookFragment } from "reading/Book";
import {
  featureFragment,
  tvSeasonFragment,
} from "watching/watchingDataProvider";
import { videoGameFragment } from "playing/recentGamesDataProvider";

const HIGHLIGHT_RATING_THRESHOLD = 9;

const QUERY = gql`
  query EntertainmentHighlights(
    $startDateTime: DateTime!
    $endDateTime: DateTime!
    $rating: RatingFilter!
  ) {
    highlightedBooks: books(
      first: 50
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: MOVED_AT
      rating: $rating
    ) {
      items {
        ...Book
      }
    }
    highlightedFeatures: features(
      first: 50
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: MOVED_AT
      rating: $rating
    ) {
      items {
        ...Feature
      }
    }
    highlightedTvSeasons: tvSeasons(
      first: 50
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: MOVED_AT
      rating: $rating
    ) {
      items {
        ...TvSeason
      }
    }
    highlightedVideoGames: videoGames(
      first: 50
      startDate: $startDateTime
      endDate: $endDateTime
      sortBy: MOVED_AT
      rating: $rating
    ) {
      items {
        ...VideoGame
      }
    }
  }

  ${bookFragment}
  ${featureFragment}
  ${tvSeasonFragment}
  ${videoGameFragment}
`;

export type EntertainmentHighlightsData = {
  entertainmentHighlights: {
    books: readonly BookFragment[];
    features: readonly FeatureFragment[];
    tvSeasons: readonly TvSeasonFragment[];
    videoGames: readonly VideoGameFragment[];
  };
};

type EntertainmentHighlightsQuery = {
  highlightedBooks: { items: readonly BookFragment[] } | null;
  highlightedFeatures: { items: readonly FeatureFragment[] } | null;
  highlightedTvSeasons: { items: readonly TvSeasonFragment[] } | null;
  highlightedVideoGames: { items: readonly VideoGameFragment[] } | null;
};

function isCurrentYear(year: number) {
  return year === new Date().getFullYear();
}

function buildQueryVariables(year: number, overrideEndDate?: Date) {
  return {
    startDateTime: `${year}-01-01T00:00:00Z`,
    endDateTime: overrideEndDate
      ? formatISO(overrideEndDate)
      : `${year}-12-31T23:59:59Z`,
    rating: { gte: HIGHLIGHT_RATING_THRESHOLD },
  };
}

const entertainmentHighlightsDataProvider: DataProvider<
  { filterYear: number },
  EntertainmentHighlightsData
> = async ({ filterYear }, { client }) => {
  const variables = buildQueryVariables(
    filterYear,
    isCurrentYear(filterYear) ? new Date() : undefined,
  );

  const result = await client.query<EntertainmentHighlightsQuery>({
    query: QUERY,
    variables,
  });

  return {
    entertainmentHighlights: {
      books: result.data.highlightedBooks?.items ?? [],
      features: result.data.highlightedFeatures?.items ?? [],
      tvSeasons: result.data.highlightedTvSeasons?.items ?? [],
      videoGames: result.data.highlightedVideoGames?.items ?? [],
    },
  };
};

export default entertainmentHighlightsDataProvider;

export function useEntertainmentHighlightsData(): EntertainmentHighlightsData {
  return usePageData();
}
