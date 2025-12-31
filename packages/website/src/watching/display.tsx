import React from "react";
import ContentBlock from "../component/ContentBlock";
import Infoline from "../component/Infoline";
import TwoRowText from "../component/TwoRowText";
import Date from "../component/Date";
import { Star, Clock } from "react-feather";
import {
  FeatureFragment,
  TvSeriesFragment,
  TvSeasonFragment,
} from "../generated/graphql";
import { isSameDay } from "date-fns/isSameDay";
import { parseISO } from "date-fns/parseISO";

type WatchingItem = Pick<
  FeatureFragment,
  "image" | "title" | "rating" | "releaseYear" | "shelf"
>;

const WatchingImage = ({
  image,
  title,
}: Pick<WatchingItem, "image" | "title">) =>
  image ? (
    <img
      className="mr-2 object-contain"
      src={image.url}
      alt={`Poster for ${title}`}
    />
  ) : null;

const WatchingInfoline = ({
  rating,
  shelf,
}: Pick<WatchingItem, "rating" | "shelf">) => (
  <Infoline>
    <span>
      <>{shelf.name} </>
      {rating ? (
        <>
          <Star className="inline" size={14} /> {rating}/10
        </>
      ) : null}
    </span>
  </Infoline>
);

const Watching = ({
  image,
  title,
  rating,
  type,
  shelf,
  releaseYear,
  children,
}: WatchingItem & { type: string; children: React.ReactNode }) => (
  <ContentBlock>
    <div className="flex">
      <WatchingImage image={image} title={title} />
      <div className="my-2 space-y-2">
        <TwoRowText row1={title} row2={`${type}, ${releaseYear}`} />
        {children}
      </div>
    </div>
    <WatchingInfoline shelf={shelf} rating={rating} />
  </ContentBlock>
);

export const Feature: React.FunctionComponent<{ feature: FeatureFragment }> = ({
  feature,
}) => (
  <Watching {...feature} type="Feature">
    <div className="text-xs">
      <Clock className="inline" size={14} /> <Date>{feature.movedAt}</Date>
    </div>
    {feature.notes ? <div className="text-xs">{feature.notes}</div> : null}
  </Watching>
);

export const TvSeries: React.FunctionComponent<{
  tvSeries: TvSeriesFragment;
}> = ({ tvSeries }) => (
  <Watching {...tvSeries} type="TV Series">
    {tvSeries.seasons?.length === 0 ? (
      <>
        <div className="text-xs">
          Started: <Clock className="inline" size={14} />{" "}
          <Date>{tvSeries.addedAt}</Date>
        </div>
        <div className="text-xs">
          {tvSeries.shelf.name}: <Clock className="inline" size={14} />{" "}
          <Date>{tvSeries.movedAt}</Date>
        </div>
      </>
    ) : null}
    {tvSeries.seasons?.length > 0
      ? tvSeries.seasons.map((season) => (
          <div key={season.seasonNumber} className="text-xs space-y-1">
            <div>
              Season {season.seasonNumber}
              {season.seasonTitle ? `/ ${season.seasonTitle} ` : null}
            </div>
            <div className="ml-4">
              {season.shelf.name}{" "}
              {season.rating ? (
                <>
                  <Star className="inline" size={14} /> {season.rating}/10
                </>
              ) : null}{" "}
            </div>
            <div className="ml-4">
              <Clock className="inline" size={14} />{" "}
              <Date>{season.addedAt}</Date>{" "}
              {!isSameDay(
                parseISO(season.addedAt),
                parseISO(season.movedAt),
              ) ? (
                <>
                  — <Date>{season.movedAt}</Date>{" "}
                </>
              ) : null}
            </div>
          </div>
        ))
      : null}
    {tvSeries.notes ? <div className="text-xs">{tvSeries.notes}</div> : null}
  </Watching>
);

export const TvSeason: React.FunctionComponent<{
  tvSeason: TvSeasonFragment;
}> = ({ tvSeason }) => {
  const { series } = tvSeason;
  const seasonLabel = tvSeason.seasonTitle
    ? `Season ${tvSeason.seasonNumber} / ${tvSeason.seasonTitle}`
    : `Season ${tvSeason.seasonNumber}`;

  return (
    <Watching
      image={series.image}
      title={series.title}
      rating={tvSeason.rating}
      releaseYear={series.releaseYear}
      shelf={tvSeason.shelf}
      type="TV Season"
    >
      <div className="text-xs font-medium">{seasonLabel}</div>
      <div className="text-xs">
        <Clock className="inline" size={14} /> <Date>{tvSeason.addedAt}</Date>
        {!isSameDay(parseISO(tvSeason.addedAt), parseISO(tvSeason.movedAt)) ? (
          <>
            {" "}
            — <Date>{tvSeason.movedAt}</Date>
          </>
        ) : null}
      </div>
    </Watching>
  );
};
