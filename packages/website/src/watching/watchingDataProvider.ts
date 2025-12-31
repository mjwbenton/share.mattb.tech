import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { WatchingQuery } from "generated/graphql";
import { useQuery } from "@apollo/client";

export const featureFragment = gql`
  fragment Feature on Feature {
    id
    title
    image {
      url
      width
      height
    }
    shelf {
      name
    }
    releaseYear
    movedAt
    notes
    rating
  }
`;

export const tvSeriesFragment = gql`
  fragment TvSeries on TvSeries {
    id
    title
    image {
      url
      width
      height
    }
    shelf {
      id
      name
    }
    releaseYear
    movedAt
    addedAt
    notes
    rating
    seasons {
      id
      seasonNumber
      seasonTitle
      rating
      movedAt
      addedAt
      shelf {
        id
        name
      }
    }
  }
`;

export const tvSeasonFragment = gql`
  fragment TvSeason on TvSeason {
    id
    seasonNumber
    seasonTitle
    rating
    movedAt
    addedAt
    shelf {
      id
      name
    }
    series {
      title
      releaseYear
      image {
        url
        width
        height
      }
    }
  }
`;

const QUERY = gql`
  query Watching($after: ID) {
    watching(first: 15, after: $after) {
      total
      hasNextPage
      nextPageCursor
      items {
        __typename
        ...Feature
        ...TvSeries
      }
    }
  }

  ${featureFragment}
  ${tvSeriesFragment}
`;

const watchingDataProvider: DataProvider<never, WatchingQuery> = async (
  _: never,
  { client },
) => {
  const result = await client.query<WatchingQuery>({
    query: QUERY,
  });
  return result.data;
};

export default watchingDataProvider;

export function useWatching() {
  const { data, loading, fetchMore } = useQuery<WatchingQuery>(QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const { items, total, hasNextPage, nextPageCursor } = data!.watching!;
  return {
    items,
    total,
    hasNextPage,
    loadNextPage: () => fetchMore({ variables: { after: nextPageCursor } }),
    loading,
  };
}
