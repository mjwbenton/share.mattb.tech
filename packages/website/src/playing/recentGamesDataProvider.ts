import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { RecentGamesQuery } from "generated/graphql";
import { useQuery } from "@apollo/client";

export const videoGameFragment = gql`
  fragment VideoGame on VideoGame {
    id
    title
    image {
      url
      width
      height
    }
    platforms {
      name
    }
    shelf {
      id
      name
    }
    addedAt
    movedAt
    notes
    rating
  }
`;

const QUERY = gql`
  query RecentGames($after: ID) {
    recentGames: videoGames(first: 15, after: $after) {
      total
      hasNextPage
      nextPageCursor
      items {
        ...VideoGame
      }
    }
  }

  ${videoGameFragment}
`;

const recentGamesDataProvider: DataProvider<never, RecentGamesQuery> = async (
  _: never,
  { client },
) => {
  const result = await client.query<RecentGamesQuery>({
    query: QUERY,
  });
  return result.data;
};

export default recentGamesDataProvider;

export function useRecentGames() {
  const { data, loading, fetchMore } = useQuery<RecentGamesQuery>(QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const { items, total, hasNextPage, nextPageCursor } = data!.recentGames!;
  return {
    items,
    total,
    hasNextPage,
    loadNextPage: () => fetchMore({ variables: { after: nextPageCursor } }),
    loading,
  };
}
