import ContentBlock from "component/ContentBlock";
import ErrorDisplay from "component/ErrorDisplay";
import Infoline from "component/Infoline";
import EmbeddedWrapper from "component/EmbeddedWrapper";
import SubdivisionHeading from "component/SubdivisionHeading";
import React from "react";
import { Clock } from "react-feather";
import { useRepositories } from "./repositoriesDataProvider";
import Spinner from "component/Spinner";

export default function Repositories() {
  const { total, groups, error } = useRepositories();
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  if (!groups) {
    return <Spinner />;
  }
  return (
    <EmbeddedWrapper>
      <p className="mb-8">
        <b>{total}</b> total repositories
      </p>
      {groups.map(({ topic, repos }) => (
        <div key={topic} className="mt-20">
          <SubdivisionHeading>{topic}</SubdivisionHeading>
          {repos.map((n) => (
            <ContentBlock key={`${topic}-${n.name}`}>
              <h3 className="text-lg font-bold">{n.name}</h3>
              {n.description && <p className="mb-4">{n.description}</p>}
              <div className="flex justify-between w-full mb-4 text-xs">
                <div className="text-left">
                  Created: <Clock className="inline-block" size={14} />{" "}
                  {n.createdAt}
                </div>
                <div className="text-right">
                  Last Updated: <Clock className="inline-block" size={14} />{" "}
                  {n.updatedAt}
                </div>
              </div>
              <Infoline externalLinkUrl={n.url} externalLinkText="Gh">
                {n.isPrivate && "Private, "}
                {n.license || "UNLICENSED"}
                {", "}
                {n.primaryLanguage || "UNKNOWN"}
              </Infoline>
            </ContentBlock>
          ))}
        </div>
      ))}
    </EmbeddedWrapper>
  );
}
