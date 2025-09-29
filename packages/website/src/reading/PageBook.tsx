import { PageBookQuery } from "generated/graphql";
import Book from "./Book";
import { usePageData } from "@mattb.tech/data-fetching";
import EmbeddedWrapper from "component/EmbeddedWrapper";

const PageBook: React.FunctionComponent = () => {
  const { book }: PageBookQuery = usePageData();
  if (!book) {
    return null;
  }
  return (
    <EmbeddedWrapper>
      <Book book={book} />
    </EmbeddedWrapper>
  );
};

export default PageBook;
