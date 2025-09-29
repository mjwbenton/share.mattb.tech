import gql from "graphql-tag";
import { DataProvider } from "@mattb.tech/data-fetching";
import { PageBookQuery } from "generated/graphql";
import { fragment } from "./Book";

const QUERY = gql`
  query PageBook($bookId: ID!) {
    book(id: $bookId) {
      ...Book
    }
  }

  ${fragment}
`;

const pageBookDataProvider: DataProvider<never, PageBookQuery> = async (
  { bookId }: { bookId: string },
  { client }
) => {
  const result = await client.query<PageBookQuery>({
    query: QUERY,
    variables: { bookId },
  });
  return result.data;
};

export default pageBookDataProvider;
