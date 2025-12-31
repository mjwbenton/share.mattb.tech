import React from "react";
import EmbeddedWrapper from "component/EmbeddedWrapper";
import Book from "reading/Book";
import { Feature, TvSeason } from "watching/display";
import Game from "playing/Game";
import { useEntertainmentHighlightsData } from "./entertainmentHighlightsDataProvider";

export default function EntertainmentHighlights() {
  const { entertainmentHighlights } = useEntertainmentHighlightsData();

  const { books, features, tvSeasons, videoGames } = entertainmentHighlights;

  return (
    <EmbeddedWrapper>
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
      {features.map((feature) => (
        <Feature key={feature.id} feature={feature} />
      ))}
      {tvSeasons.map((tvSeason) => (
        <TvSeason key={tvSeason.id} tvSeason={tvSeason} />
      ))}
      {videoGames.map((game) => (
        <Game key={game.id} game={game} />
      ))}
    </EmbeddedWrapper>
  );
}
