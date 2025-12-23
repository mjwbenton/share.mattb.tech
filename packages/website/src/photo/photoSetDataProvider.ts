import gql from "graphql-tag";
import { fragment } from "./Photo";
import { PhotoFragment, PhotoSetQuery } from "generated/graphql";
import { DataProvider } from "@mattb.tech/data-fetching";

export const QUERY = gql`
  query PhotoSet($photosetId: ID!) {
    page: photoSet(photosetId: $photosetId, first: 150) {
      hasNextPage
      nextPageCursor
      items {
        ...Photo
      }
    }
  }
  ${fragment}
`;

const photoSetDataProvider: DataProvider<
  { photosetId: string },
  { photoSet: readonly PhotoFragment[] }
> = async ({ photosetId }, { client }) => {
  if (!photosetId) {
    throw new Error("Must provide photosetId");
  }
  const result = await client.query<PhotoSetQuery>({
    query: QUERY,
    variables: { photosetId },
  });
  if (result.data.page == null) {
    throw new Error(`No photoset with id ${photosetId}`);
  }
  const { items, hasNextPage } = result.data.page;
  if (hasNextPage) {
    throw new Error(`Too many photos in set ${photosetId}`);
  }
  return {
    photoSet: items,
  };
};

export default photoSetDataProvider;
