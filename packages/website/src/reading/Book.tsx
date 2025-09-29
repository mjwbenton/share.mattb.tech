import React from "react";
import ContentBlock from "../component/ContentBlock";
import Infoline from "../component/Infoline";
import TwoRowText from "../component/TwoRowText";
import Date from "../component/Date";
import { Star, Clock } from "react-feather";
import { BookFragment } from "../generated/graphql";
import gql from "graphql-tag";

const READ_SHELF_ID = "Read";

export const fragment = gql`
  fragment Book on Book {
    id
    title
    image {
      url
      width
      height
    }
    author
    shelf {
      id
      name
    }
    addedAt
    movedAt
    notes
    rating
    highlights(first: 0) {
      total
    }
  }
`;

const Book: React.FunctionComponent<{ book: BookFragment }> = ({ book }) => (
  <ContentBlock>
    <div className="flex">
      {book.image ? (
        <img
          className="mr-2 object-cover"
          src={book.image.url}
          alt={`Cover of ${book.title}`}
        />
      ) : null}
      <div className="my-2 space-y-2">
        <TwoRowText row1={book.title} row2={book.author} />
        {book.addedAt ? (
          <div className="text-xs">
            Started: <Clock className="inline" size={14} />{" "}
            <Date>{book.addedAt}</Date>
          </div>
        ) : null}
        {book.shelf.id === READ_SHELF_ID ? (
          <div className="text-xs">
            Finished: <Clock className="inline" size={14} />{" "}
            <Date>{book.movedAt}</Date>
          </div>
        ) : null}
        {book.notes ? <div className="text-xs">{book.notes}</div> : null}
      </div>
    </div>
    <Infoline
      externalLinkText={
        book.highlights.total
          ? `${book.highlights.total} highlights`
          : undefined
      }
      externalLinkUrl={
        book.highlights.total
          ? `/entertainment/reading/highlights?bookId=${book.id}`
          : undefined
      }
    >
      <div className="space-y-2">
        <span>
          <>{book.shelf.name} </>
          {book.rating ? (
            <>
              <Star className="inline" size={14} /> {book.rating}/10
            </>
          ) : null}
        </span>
      </div>
    </Infoline>
  </ContentBlock>
);

export default Book;
