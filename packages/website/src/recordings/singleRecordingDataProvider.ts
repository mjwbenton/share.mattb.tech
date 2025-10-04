import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { RecordingsQuery } from "generated/graphql";

const QUERY = gql`
  query RecordingsSingle {
    recordings {
      name
      url
    }
  }
`;

const singleRecordingDataProvider: DataProvider<
  { params: { recording: string } },
  { recording: { name: string; url: string } | undefined }
> = async ({ params: { recording } }, { client }) => {
  const result = await client.query<RecordingsQuery>({
    query: QUERY,
  });
  return {
    recording: result.data.recordings.find((r) => r.name === recording),
  };
};

export default singleRecordingDataProvider;
