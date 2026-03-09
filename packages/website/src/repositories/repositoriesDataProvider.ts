import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { RepositoriesQuery } from "generated/graphql";

const QUERY = gql`
  query Repositories {
    page: repositories(first: 100) {
      total
      items {
        id
        name
        url
        createdAt
        updatedAt
        description
        license
        primaryLanguage
        topics
        isPrivate
      }
    }
  }
`;

type Repo = RepositoriesQuery["page"]["items"][number];

export type TopicGroup = {
  topic: string;
  repos: Repo[];
};

function groupByTopic(items: RepositoriesQuery["page"]["items"]): TopicGroup[] {
  const topicMap = new Map<string, Repo[]>();
  const uncategorised: Repo[] = [];

  for (const repo of items) {
    if (repo.topics.length === 0) {
      uncategorised.push(repo);
    } else {
      for (const topic of repo.topics) {
        if (!topicMap.has(topic)) {
          topicMap.set(topic, []);
        }
        topicMap.get(topic)!.push(repo);
      }
    }
  }

  if (uncategorised.length > 0) {
    topicMap.set("Uncategorised", uncategorised);
  }

  return [...topicMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([topic, repos]) => ({
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      repos,
    }));
}

const repositoriesDataProvider: DataProvider<never, void> = async (
  _: never,
  { client },
) => {
  await client.query({
    query: QUERY,
  });
};

export default repositoriesDataProvider;

export function useRepositories() {
  const { data, error } = useQuery<RepositoriesQuery>(QUERY);
  const groups = useMemo(
    () => (data?.page ? groupByTopic(data.page.items) : undefined),
    [data],
  );
  return { total: data?.page?.total, groups, error };
}
