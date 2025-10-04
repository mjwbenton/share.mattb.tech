import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { RecordingsSingleQuery } from "generated/graphql";

const QUERY = gql`
  query RecordingsSingle($name: String!) {
    recording(name: $name) {
      name
      url
    }
  }
`;

const singleRecordingDataProvider: DataProvider<
  { params: { recording: string } },
  { recording: { name: string; url: string } | null }
> = async ({ params: { recording } }, { client }) => {
  const result = await client.query<RecordingsSingleQuery>({
    query: QUERY,
    variables: { name: recording },
  });
  return {
    recording: result.data.recording,
  };
};

export default singleRecordingDataProvider;
