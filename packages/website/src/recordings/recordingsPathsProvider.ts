import { PathsProvider } from "@mattb.tech/data-fetching";
import { RecordingPathsQuery } from "generated/graphql";
import gql from "graphql-tag";

const QUERY = gql`
  query RecordingPaths {
    recordings {
      name
    }
  }
`;

const recordingsPathsProvider: PathsProvider<never> = async (
  _: never,
  { client },
) => {
  const result = await client.query<RecordingPathsQuery>({
    query: QUERY,
  });
  return result.data.recordings.map((recording) => ({
    recording: recording.name,
  }));
};

export default recordingsPathsProvider;
